# update-from-figma.ps1
# 用法: 将 Figma 下载的文件夹路径作为参数传入
# 示例: .\update-from-figma.ps1 "C:\Users\Laptop\Downloads\SLS尼龙烧结工具站网页"

param(
    [Parameter(Mandatory=$true)]
    [string]$FigmaDir
)

$Workspace = $PSScriptRoot

if (-not (Test-Path $FigmaDir)) {
    Write-Host "错误: 找不到 Figma 下载目录: $FigmaDir" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Figma 更新脚本 ===" -ForegroundColor Cyan
Write-Host "Figma 来源: $FigmaDir"
Write-Host "项目目录:   $Workspace`n"

# 1. 复制源码文件（不覆盖配置文件）
Write-Host "[1/4] 复制源码文件..." -ForegroundColor Yellow
$copyItems = @("src", "index.html", "default_shadcn_theme.css", "guidelines", "ATTRIBUTIONS.md", "README.md")
foreach ($item in $copyItems) {
    $src = Join-Path $FigmaDir $item
    if (Test-Path $src) {
        $dst = Join-Path $Workspace $item
        if (Test-Path $src -PathType Container) {
            Copy-Item -Path "$src\*" -Destination $dst -Recurse -Force
        } else {
            Copy-Item -Path $src -Destination $dst -Force
        }
        Write-Host "  已复制: $item"
    }
}

# 2. 重新应用 BrowserRouter basename（Figma 导出不含此配置）
Write-Host "`n[2/4] 修复路由配置..." -ForegroundColor Yellow
$appFile = Join-Path $Workspace "src\app\App.tsx"
if (Test-Path $appFile) {
    $content = Get-Content $appFile -Raw
    if ($content -match '<BrowserRouter>') {
        $content = $content -replace '<BrowserRouter>', '<BrowserRouter basename="/sls-icanhelp">'
        Set-Content -Path $appFile -Value $content -NoNewline
        Write-Host "  已添加 basename=""/sls-icanhelp"""
    } else {
        Write-Host "  basename 已存在，跳过"
    }
}

# 3. 构建验证
Write-Host "`n[3/4] 构建验证..." -ForegroundColor Yellow
Push-Location $Workspace
npm run build 2>&1 | Write-Host
$buildOk = $LASTEXITCODE -eq 0
Pop-Location

if (-not $buildOk) {
    Write-Host "`n构建失败！请检查错误信息。" -ForegroundColor Red
    exit 1
}

# 4. 完成
Write-Host "`n[4/4] 更新完成！" -ForegroundColor Green
Write-Host "`n下一步:" -ForegroundColor Cyan
Write-Host "  1. 打开 GitHub Desktop"
Write-Host "  2. 写 commit message (如: update from Figma)"
Write-Host "  3. Commit to main -> Push origin"
Write-Host "  4. 等 1-2 分钟，网站自动更新"
Write-Host "`n网站地址: https://le0n789.github.io/sls-icanhelp/`n" -ForegroundColor Green
