# 📤 需要上传的文件清单

## 🔴 必须上传的文件（安全修复）

### 1. 根目录文件
- ✅ **`.htaccess`** - 已更新，添加了敏感文件保护规则
  - 位置：网站根目录
  - 作用：保护配置文件、阻止目录列表、安全头部

### 2. bat 目录文件
- ✅ **`bat/.htaccess`** - 新建文件，专门保护 bat 目录
  - 位置：`bat/` 目录
  - 作用：阻止直接访问配置文件（.json, .config, .tpl等）

- ✅ **`bat/rd-mailform.php`** - 已更新，添加了安全验证
  - 位置：`bat/` 目录
  - 作用：输入验证、文件上传安全、XSS防护

## 📋 完整文件清单

### 核心安全文件（必须上传）
```
网站根目录/
├── .htaccess                    ← 已更新（添加文件保护）
└── bat/
    ├── .htaccess                ← 新建（保护bat目录）
    └── rd-mailform.php          ← 已更新（安全验证）
```

## 🔍 文件修改详情

### 1. `.htaccess` (根目录)
**修改内容：**
- ✅ 添加敏感文件保护规则
- ✅ 阻止访问 .json, .log, .config 等文件
- ✅ 阻止访问隐藏文件
- ✅ 保护 bat 目录中的配置文件

**文件路径：** `publicmain.github.io-main 2/.htaccess`

### 2. `bat/.htaccess` (新建)
**新建内容：**
- ✅ 阻止直接访问配置文件
- ✅ 允许 PHP 文件执行

**文件路径：** `publicmain.github.io-main 2/bat/.htaccess`

### 3. `bat/rd-mailform.php`
**修改内容：**
- ✅ 添加输入验证和清理函数
- ✅ 添加邮箱格式验证
- ✅ 添加文件上传安全验证
- ✅ 防止 XSS 攻击
- ✅ 防止路径遍历攻击

**文件路径：** `publicmain.github.io-main 2/bat/rd-mailform.php`

## 📝 上传步骤

### 步骤 1：备份现有文件
```bash
# 在服务器上备份现有文件
cp .htaccess .htaccess.backup
cp bat/rd-mailform.php bat/rd-mailform.php.backup
```

### 步骤 2：上传文件
使用 FTP/SFTP 或 cPanel 文件管理器上传：

1. **上传 `.htaccess`** 到网站根目录
   - 覆盖现有文件

2. **上传 `bat/.htaccess`** 到 `bat/` 目录
   - 这是新文件

3. **上传 `bat/rd-mailform.php`** 到 `bat/` 目录
   - 覆盖现有文件

### 步骤 3：设置文件权限
```bash
# 设置 .htaccess 文件权限
chmod 644 .htaccess
chmod 644 bat/.htaccess

# 设置 PHP 文件权限
chmod 644 bat/rd-mailform.php

# 设置配置文件权限（如果可能）
chmod 600 bat/rd-mailform.config.json
```

### 步骤 4：测试
1. ✅ 测试联系表单提交
2. ✅ 测试文件上传功能
3. ✅ 验证敏感文件无法直接访问
4. ✅ 检查网站是否正常工作

## ⚠️ 重要提示

### 不要上传的文件
- ❌ `SECURITY_AUDIT.md` - 仅用于参考
- ❌ `SECURITY_FIXES.md` - 仅用于参考
- ❌ `FILES_TO_UPLOAD.md` - 仅用于参考（本文件）
- ❌ `remove_html_extensions.py` - 开发脚本，不需要
- ❌ 任何 `.log` 文件 - 本地调试文件

### 需要保留的文件（不要删除）
- ✅ `bat/rd-mailform.config.json` - SMTP配置（已受保护）
- ✅ `bat/rd-mailform.tpl` - 邮件模板（已受保护）
- ✅ `bat/reCaptcha.php` - reCAPTCHA验证（已受保护）
- ✅ 所有其他现有文件

## 🔄 如果出现问题

### 回滚步骤
如果上传后出现问题，可以恢复备份：

```bash
# 恢复备份
cp .htaccess.backup .htaccess
cp bat/rd-mailform.php.backup bat/rd-mailform.php
```

### 检查清单
- [ ] `.htaccess` 文件已上传到根目录
- [ ] `bat/.htaccess` 文件已上传到 bat 目录
- [ ] `bat/rd-mailform.php` 文件已上传到 bat 目录
- [ ] 文件权限设置正确
- [ ] 网站功能测试通过

## 📞 需要帮助？

如果上传后遇到问题：
1. 检查文件路径是否正确
2. 检查文件权限
3. 查看服务器错误日志
4. 测试表单功能是否正常

---

**最后更新：** 2025-01-06  
**状态：** ✅ 准备上传

