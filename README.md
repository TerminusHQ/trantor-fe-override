## 项目初始化

```cmd
npm install && cd webnest-theme && npm install && cd ../
```

## 统一工作台二开

1. `src/navigation-override.tsx` 二开导航栏
2. `src/side-navigation-override.tsx` 二开侧边菜单栏

## 主题样式修改

在 `webnest-theme/theme_antd.less` 设置 `antd` 样式变量
在 `webnest-theme/nusi.scss` 设置 `nusi` 样式变量，以及一些样式定制

### 内置主题色

1. 浅色菜单，蓝色导航。

```scss
$primary: #0073FF
:root {
  --webnest-nav-bg-color: #3E4D65; // 导航栏背景颜色
  --webnest-nav-color: #ffffff; // 导航栏文字/图标颜色
  --webnest-menu-icon-col-bg: #f5f5f5; // 侧边菜单图标栏背景颜色
  --webnest-menu-col-bg: #ffffff; // 侧边菜单栏背景颜色
  --webnest-menu-border-color: #ebedf0; // 侧边菜单border颜色
  --webnest-menu-color: #515559; // 侧边一级菜单颜色;
  --webnest-sub-menu-color: #515559; // 侧边子菜单颜色;
  --webnest-menu-color-hover: #0073FF; // 侧边菜单hover颜色;
  --webnest-menu-color-selected: #0073FF; // 侧边菜单选中颜色;
  --webnest-menu-bg-selected: rgba(0, 115, 255, 0.06);; // 侧边菜单选中背景色
  --webnest-menu-icon-color: #17181A; // 侧边菜单图标颜色
  --webnest-menu-icon-color-selected: #ffffff; // 侧边菜单图标选中颜色
  --webnest-menu-icon-bg-selected: #0073FF; // 侧边菜单图标选中颜色
  --webnest-menu-opened-sign-color: #0073FF; // 侧边菜单打开后的标志颜色（竖杆）
}
```

2. 浅色菜单，深色导航

```scss
$primary: #0073FF
:root {
  --webnest-nav-bg-color: #3E4D65; // 导航栏背景颜色
  --webnest-nav-color: #ffffff; // 导航栏文字/图标颜色
  --webnest-menu-icon-col-bg: #f5f5f5; // 侧边菜单图标栏背景颜色
  --webnest-menu-col-bg: #ffffff; // 侧边菜单栏背景颜色
  --webnest-menu-border-color: #ebedf0; // 侧边菜单border颜色
  --webnest-menu-color: #515559; // 侧边一级菜单颜色;
  --webnest-sub-menu-color: #515559; // 侧边子菜单颜色;
  --webnest-menu-color-hover: #0073FF; // 侧边菜单hover颜色;
  --webnest-menu-color-selected: #0073FF; // 侧边菜单选中颜色;
  --webnest-menu-bg-selected: rgba(0, 115, 255, 0.06);; // 侧边菜单选中背景色
  --webnest-menu-icon-color: #17181A; // 侧边菜单图标颜色
  --webnest-menu-icon-color-selected: #ffffff; // 侧边菜单图标选中颜色
  --webnest-menu-icon-bg-selected: #0073FF; // 侧边菜单图标选中颜色
  --webnest-menu-opened-sign-color: #0073FF; // 侧边菜单打开后的标志颜色（竖杆）
}

```

3.浅色菜单，彩色导航

```scss
$primary: #4e66de
:root {
  --webnest-nav-bg-color: radial-gradient(
    50% 38500.01% at 66.04% 50%,
    #6ab2f4 0%,
    #5f51f8 100%
  ); // 导航栏背景颜色
  --webnest-nav-color: #ffffff; // 导航栏文字/图标颜色
  --webnest-menu-icon-col-bg: #f5f5f5; // 侧边菜单图标栏背景颜色
  --webnest-menu-col-bg: #ffffff; // 侧边菜单栏背景颜色
  --webnest-menu-border-color: #ebedf0; // 侧边菜单border颜色
  --webnest-menu-color: #515559; // 侧边一级菜单颜色;
  --webnest-sub-menu-color: #515559; // 侧边子菜单颜色;
  --webnest-menu-color-hover: #4e66de; // 侧边菜单hover颜色;
  --webnest-menu-color-selected: #4e66de; // 侧边菜单选中颜色;
  --webnest-menu-bg-selected: rgba(78, 102, 222, 0.06); // 侧边菜单选中背景色
  --webnest-menu-icon-color: #17181a; // 侧边菜单图标颜色
  --webnest-menu-icon-color-selected: #ffffff; // 侧边菜单图标选中颜色
  --webnest-menu-icon-bg-selected: #4e66de; // 侧边菜单图标选中颜色
  --webnest-menu-opened-sign-color: #4e66de; // 侧边菜单打开后的标志颜色（竖杆）
}
```

4. 深色菜单，蓝色系

```scss
$primary:  #0073ff
:root {
  --webnest-nav-bg-color: #ffffff; // 导航栏背景颜色
  --webnest-nav-color: #17181a; // 导航栏文字/图标颜色
  --webnest-menu-icon-col-bg: #1a2443; // 侧边菜单图标栏背景颜色
  --webnest-menu-col-bg: #2f3f6f; // 侧边菜单栏背景颜色
  --webnest-menu-border-color: rgba(255, 255, 255, 0.1); // 侧边菜单border颜色
  --webnest-menu-color: rgba(255, 255, 255, 0.8); // 侧边一级菜单颜色;
  --webnest-sub-menu-color: rgba(255, 255, 255, 0.8); // 侧边子菜单颜色;
  --webnest-menu-color-hover: #ffffff; // 侧边菜单hover颜色;
  --webnest-menu-color-selected: #ffffff; // 侧边菜单选中颜色;
  --webnest-menu-bg-selected: #0073ff; // 侧边菜单选中背景色
  --webnest-menu-icon-color: #ffffff; // 侧边菜单图标颜色
  --webnest-menu-icon-color-selected: #0073ff; // 侧边菜单图标选中颜色
  --webnest-menu-icon-bg-selected: #ffffff; // 侧边菜单图标选中颜色
  --webnest-menu-opened-sign-color: #0073ff; // 侧边菜单打开后的标志颜色（竖杆）
  --webnest-menu-header-color: #ffffff; // 菜单标题颜色
}

.pk-global-nav {
  box-shadow: 0px 4px 12px rgba(23, 24, 26, 0.16) !important;
  .pk-global-nav-avatar-item {
    border: 1.5px solid #ffffff;
    filter: drop-shadow(0px 4px 12px rgba(23, 24, 26, 0.16));
  }
}
```

5. 深色菜单，橙色系

```scss
$primary: #ED6C3B
:root {
  --webnest-nav-bg-color: #ffffff; // 导航栏背景颜色
  --webnest-nav-color: #17181a; // 导航栏文字/图标颜色
  --webnest-menu-icon-col-bg: #2F2F2F; // 侧边菜单图标栏背景颜色
  --webnest-menu-col-bg: #202020; // 侧边菜单栏背景颜色
  --webnest-menu-border-color: rgba(255, 255, 255, 0.1); // 侧边菜单border颜色
  --webnest-menu-color: rgba(255, 255, 255, 0.8); // 侧边一级菜单颜色;
  --webnest-sub-menu-color: rgba(255, 255, 255, 0.8); // 侧边子菜单颜色;
  --webnest-menu-color-hover: #ffffff; // 侧边菜单hover颜色;
  --webnest-menu-color-selected: #ffffff; // 侧边菜单选中颜色;
  --webnest-menu-bg-selected: #ED6C3B; // 侧边菜单选中背景色
  --webnest-menu-icon-color: #ffffff; // 侧边菜单图标颜色
  --webnest-menu-icon-color-selected: #ED6C3B; // 侧边菜单图标选中颜色
  --webnest-menu-icon-bg-selected: #ffffff; // 侧边菜单图标选中颜色
  --webnest-menu-opened-sign-color: #ED6C3B; // 侧边菜单打开后的标志颜色（竖杆）
  --webnest-menu-header-color: #ffffff; // 菜单标题颜色
}

.pk-global-nav {
  box-shadow: 0px 4px 12px rgba(23, 24, 26, 0.16) !important;
  .pk-global-nav-avatar-item {
    border: 1.5px solid #ffffff;
    filter: drop-shadow(0px 4px 12px rgba(23, 24, 26, 0.16));
  }
}
```

## 打包与上传

### 打包

1. 二开打包

```cmd
npm run build
```

2. 生成主题 css 文件

```cmd
cd webnest-theme && npm run transform && cd ../
```

### 上传

1. `oss.config.json` 配置 oss `region`、`accessKeyId`、`accessKeySecret` 以及 `bucket`
2. 上传二开文件

```cmd
npm run uploadOverride
```

3. 上传主题样式文件

```cmd
npm run uploadTheme
```

## 配置

1. 在 `erda` 添加部署变量 `WEBNEST_OVERRIDE` 为上传二开文件后终端提示的结果
2. 在交付控制台添加自定义变量 `WEBNEST_THEME` 为上传主题样式文件后终端提示的结果
