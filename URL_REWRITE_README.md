# URL 重写说明文档

## 概述
已成功将网站的所有URL从 `xxx.html` 格式改为更专业的友好URL格式（去掉 `.html` 扩展名）。

## 更改内容

### 1. 创建了 `.htaccess` 文件
- 位置：网站根目录
- 功能：实现URL重写，自动处理 `.html` 扩展名的添加和移除
- 特性：
  - 自动将 `/contacts` 重定向到 `/contacts.html`
  - 自动将 `/contacts.html` 301重定向到 `/contacts`（SEO友好）
  - 支持浏览器缓存优化
  - 安全头部设置

### 2. 更新了所有HTML文件
- 已更新：**42个HTML文件**
- 所有内部链接已从 `xxx.html` 改为 `xxx`
- 包括：
  - 导航菜单链接
  - 页脚链接
  - 内容区域链接
  - 表单action属性

## URL对比

### 之前（旧格式）
```
https://www.esic.edu.sg/contacts.html
https://www.esic.edu.sg/about-us.html
https://www.esic.edu.sg/admissions.html
```

### 现在（新格式）
```
https://www.esic.edu.sg/contacts
https://www.esic.edu.sg/about-us
https://www.esic.edu.sg/admissions
```

## 部署步骤

### 1. 上传文件
- ✅ 上传所有更新后的HTML文件
- ✅ 上传 `.htaccess` 文件到网站根目录

### 2. 服务器配置
确保Apache服务器满足以下要求：
- **mod_rewrite 模块已启用**
- **AllowOverride 设置为 All 或至少 FileInfo**

#### 检查 mod_rewrite 是否启用
在服务器上运行：
```bash
apache2ctl -M | grep rewrite
# 或
httpd -M | grep rewrite
```

如果未启用，启用方法：
```bash
# Ubuntu/Debian
sudo a2enmod rewrite
sudo systemctl restart apache2

# CentOS/RHEL
# 编辑 /etc/httpd/conf/httpd.conf，取消注释：
# LoadModule rewrite_module modules/mod_rewrite.so
sudo systemctl restart httpd
```

#### 检查 AllowOverride
编辑Apache配置文件（通常在 `/etc/apache2/apache2.conf` 或 `/etc/httpd/conf/httpd.conf`）：
```apache
<Directory /var/www/html>
    AllowOverride All  # 或至少 FileInfo
    ...
</Directory>
```

### 3. 测试
访问以下URL测试：
- ✅ `https://www.esic.edu.sg/contacts` - 应该正常显示
- ✅ `https://www.esic.edu.sg/contacts.html` - 应该301重定向到 `/contacts`
- ✅ `https://www.esic.edu.sg/about-us` - 应该正常显示
- ✅ `https://www.esic.edu.sg/admissions` - 应该正常显示

## 注意事项

### 1. 文件仍然存在
- 所有 `.html` 文件**仍然保留在服务器上**
- `.htaccess` 只是重写URL，不删除文件
- 这样确保向后兼容性

### 2. SEO影响
- 301重定向确保搜索引擎知道新URL
- 建议在Google Search Console中提交新的sitemap
- 旧的 `.html` URL会自动重定向到新URL

### 3. 外部链接
- 如果有外部网站链接到您的 `.html` URL，它们会自动重定向
- 不需要手动更新外部链接

### 4. 内部链接
- ✅ 所有内部链接已更新为无扩展名格式
- ✅ 导航菜单、页脚、内容链接都已更新

## 故障排除

### 问题1：URL重写不工作
**解决方案：**
1. 检查 `.htaccess` 文件是否在网站根目录
2. 检查 `mod_rewrite` 是否启用
3. 检查 `AllowOverride` 设置
4. 检查Apache错误日志：`/var/log/apache2/error.log`

### 问题2：404错误
**解决方案：**
1. 确保所有 `.html` 文件已上传
2. 检查文件权限（应该是644）
3. 检查 `.htaccess` 语法是否正确

### 问题3：500内部服务器错误
**解决方案：**
1. 检查 `.htaccess` 语法
2. 检查Apache错误日志
3. 临时重命名 `.htaccess` 测试是否是它导致的问题

## 技术细节

### .htaccess 规则说明
```apache
# 1. 如果URL有.html，301重定向到无扩展名版本
RewriteCond %{THE_REQUEST} /([^.]+)\.html [NC]
RewriteRule ^ /%1? [NC,L,R=301]

# 2. 如果请求的文件不存在，尝试添加.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
```

## 文件清单

### 已更新的文件
- ✅ `.htaccess` (新建)
- ✅ `index.html`
- ✅ `about-us.html`
- ✅ `contacts.html`
- ✅ `admissions.html`
- ✅ 以及其他39个HTML文件

### 脚本文件
- `remove_html_extensions.py` - 用于批量更新链接的Python脚本（可删除）

## 支持
如有问题，请检查：
1. Apache错误日志
2. 浏览器开发者工具的网络标签
3. 服务器配置是否正确

---

**更新日期：** 2025-01-06  
**状态：** ✅ 已完成

