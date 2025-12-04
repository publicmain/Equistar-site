<?php
// Disable error display in production
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Get the directory of this script
$scriptDir = __DIR__;

// Load configuration file
$configPath = $scriptDir . DIRECTORY_SEPARATOR . "rd-mailform.config.json";

if (!file_exists($configPath)) {
    die('MF003'); // Configuration file not found
}

$formConfigFile = file_get_contents($configPath);
$formConfig = json_decode($formConfigFile, true);

if ($formConfig === null) {
    die('MF003'); // Invalid JSON configuration
}

date_default_timezone_set('Etc/UTC');

try {
    // Load PHPMailer
    $phpmailerPath = $scriptDir . DIRECTORY_SEPARATOR . 'phpmailer' . DIRECTORY_SEPARATOR . 'PHPMailerAutoload.php';
    
    if (!file_exists($phpmailerPath)) {
        die('MF003'); // PHPMailer not found
    }
    
    require $phpmailerPath;
    
    if (!class_exists('PHPMailer')) {
        die('MF003');
    }

    $recipients = $formConfig['recipientEmail'];

    preg_match_all("/([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)/", $recipients, $addresses, PREG_OFFSET_CAPTURE);

    if (!count($addresses[0])) {
        die('MF001');
    }

    function getRemoteIPAddress() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];

        } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        return $_SERVER['REMOTE_ADDR'];
    }

    $remoteIP = getRemoteIPAddress();
    
    if (preg_match('/^(127\.|192\.168\.|::1)/', $remoteIP)) {
        die('MF002');
    }

    // Load email template
    $templatePath = $scriptDir . DIRECTORY_SEPARATOR . 'rd-mailform.tpl';
    
    if (!file_exists($templatePath)) {
        die('MF003'); // Template file not found
    }
    $template = file_get_contents($templatePath);

    if (isset($_POST['form-type'])) {
        switch ($_POST['form-type']){
            case 'contact':
                $subject = 'A message from your site visitor';
                break;
            case 'subscribe':
                $subject = 'Subscribe request';
                break;
            case 'order':
                $subject = 'Order request';
                break;
            default:
                $subject = 'A message from your site visitor';
                break;
        }
    }else{
        die('MF004');
    }

    if (isset($_POST['email'])) {
        $template = str_replace(
            array("<!-- #{FromState} -->", "<!-- #{FromEmail} -->"),
            array("Email:", $_POST['email']),
            $template);
    }

    if (isset($_POST['message'])) {
        $template = str_replace(
            array("<!-- #{MessageState} -->", "<!-- #{MessageDescription} -->"),
            array("Message:", $_POST['message']),
            $template);
    }

    // In a regular expression, the character \v is used as "anything", since this character is rare
    preg_match("/(<!-- #\{BeginInfo\} -->)([^\v]*?)(<!-- #\{EndInfo\} -->)/", $template, $matches, PREG_OFFSET_CAPTURE);
    foreach ($_POST as $key => $value) {
        if ($key != "counter" && $key != "email" && $key != "message" && $key != "form-type" && $key != "g-recaptcha-response" && !empty($value)){
            $info = str_replace(
                array("<!-- #{BeginInfo} -->", "<!-- #{InfoState} -->", "<!-- #{InfoDescription} -->"),
                array("", ucfirst($key) . ':', $value),
                $matches[0][0]);

            $template = str_replace("<!-- #{EndInfo} -->", $info, $template);
        }
    }

    $template = str_replace(
        array("<!-- #{Subject} -->", "<!-- #{SiteName} -->"),
        array($subject, $_SERVER['SERVER_NAME']),
        $template);

    $mail = new PHPMailer();

    if ($formConfig['useSmtp']) {
        //Tell PHPMailer to use SMTP
        $mail->isSMTP();

        // Disable SMTP debugging for production
        $mail->SMTPDebug = 0;

        // Set the hostname of the mail server
        $mail->Host = $formConfig['host'];

        // Set the SMTP port number - likely to be 25, 465 or 587
        $mail->Port = $formConfig['port'];

        // Whether to use SMTP authentication
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = "ssl";

        // Username to use for SMTP authentication
        $mail->Username = $formConfig['username'];

        // Password to use for SMTP authentication
        $mail->Password = $formConfig['password'];
    }

    // Use configured email as From address for SMTP authentication
    if ($formConfig['useSmtp']) {
        $mail->From = $formConfig['username'];
    } else {
        $mail->From = $_POST['email'];
    }

    # Attach file
    if (isset($_FILES['file']) &&
        $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $mail->AddAttachment($_FILES['file']['tmp_name'],
            $_FILES['file']['name']);
    }

    if (isset($_POST['name'])){
        $mail->FromName = $_POST['name'];
    }else{
        $mail->FromName = "Site Visitor";
    }
    
    // Set Reply-To to user's email so replies go to the visitor
    if (isset($_POST['email'])) {
        $replyName = isset($_POST['name']) ? $_POST['name'] : 'Site Visitor';
        $mail->addReplyTo($_POST['email'], $replyName);
    }

    foreach ($addresses[0] as $key => $value) {
        $mail->addAddress($value[0]);
    }

    $mail->CharSet = 'utf-8';
    $mail->Subject = $subject;
    $mail->MsgHTML($template);
    
    $result = $mail->send();
    
    if ($result) {
        die('MF000');
    } else {
        die('MF254');
    }
} catch (Error $e) {
    // Catch PHP 7+ Error exceptions (fatal errors)
    error_log('Mail Form Error: ' . $e->getMessage());
    die('MF255');
} catch (Exception $e) {
    // Return appropriate error code
    $exceptionClass = get_class($e);
    if (strpos($exceptionClass, 'phpmailer') !== false) {
        die('MF254');
    } else {
        die('MF255');
    }
}
