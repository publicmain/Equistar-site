<?php
/**
 * PHPMailer SPL autoloader.
 * PHP Version 5
 * @package PHPMailer
 * @link https://github.com/PHPMailer/PHPMailer/ The PHPMailer GitHub project
 * @author Marcus Bointon (Synchro/coolbru) <phpmailer@synchromedia.co.uk>
 * @author Jim Jagielski (jimjag) <jimjag@gmail.com>
 * @author Andy Prevost (codeworxtech) <codeworxtech@users.sourceforge.net>
 * @author Brent R. Matzelle (original founder)
 * @copyright 2012 - 2014 Marcus Bointon
 * @copyright 2010 - 2012 Jim Jagielski
 * @copyright 2004 - 2009 Andy Prevost
 * @license http://www.gnu.org/copyleft/lesser.html GNU Lesser General Public License
 * @note This program is distributed in the hope that it will be useful - WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.
 */

/**
 * PHPMailer SPL autoloader.
 * @param string $classname The name of the class to load
 */
function PHPMailerAutoload($classname)
{
    //Can't use __DIR__ as it's only in PHP 5.3+
    $filename = dirname(__FILE__).DIRECTORY_SEPARATOR.'class.'.strtolower($classname).'.php';
    if (is_readable($filename)) {
        require $filename;
    }
}

// Register autoloader
// Note: __autoload() is deprecated in PHP 7.2+ and removed in PHP 8.0+
// We always use spl_autoload_register for compatibility with all PHP versions
if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
    // PHP 5.3+ supports prepend parameter
    spl_autoload_register('PHPMailerAutoload', true, true);
} elseif (version_compare(PHP_VERSION, '5.1.2', '>=')) {
    // PHP 5.1.2+ supports spl_autoload_register
    spl_autoload_register('PHPMailerAutoload');
} else {
    // For very old PHP versions (< 5.1.2), try to register anyway
    // Most modern servers won't reach here
    if (function_exists('spl_autoload_register')) {
        spl_autoload_register('PHPMailerAutoload');
    }
}
