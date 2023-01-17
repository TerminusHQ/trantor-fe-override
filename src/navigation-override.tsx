import React, { ComponentClass, Fragment } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import * as Workspace from "@terminus/t-workspace";
import { observer } from "mobx-react";
import { TModule, InjectModules } from "@terminus/trantor-framework";
import { GlobalNavigationProps } from "@terminus/t-workspace/lib/routes/trantor.layout/GlobalNavigation";
import intl from "@terminus/i18n-plat-sdk-js";
import { computed, action } from "mobx";
import {
  GlobalNavigationProps as NGlobalNavigationProps,
  RightOperationItemProps,
  UserMenuProps,
  Theme,
} from "@terminus/nusi/es/global-navigation/interface";
import { GlobalNavigation as NGlobalNavigation, Icon } from "@terminus/nusi";
import { get, findIndex, find, size } from "lodash";
import { Entry as DashboardEntry } from "@terminus/t-extensions";
import { Space, message } from "antd";
import cx from "classnames";
import VersionInfo from "./VersionInfo";

const GlobalNavigation: ComponentClass<GlobalNavigationProps &
  RouteComponentProps> = Workspace.GlobalNavigation;

class GlobalNavigationOverwrite extends GlobalNavigation {
  private timer = null;
  private clicks = 0;
  public state = {
    versionVisible: false,
  };

  @computed
  get layout() {
    return this.props.layout || "vertical";
  }

  @computed
  get MALL_URL() {
    const extendConfigurations =
      get(
        this.props.configure,
        "dynamic.InitialConfiguration.extendConfigurations"
      ) || [];
    return extendConfigurations.find((config) => config.key === "MALL_URL")
      ?.value;
  }
  @computed
  get WEBNEST_THEME() {
    const extendConfigurations =
      get(
        this.props.configure,
        "dynamic.InitialConfiguration.extendConfigurations"
      ) || [];
    return extendConfigurations.find((config) => config.key === "WEBNEST_THEME")
      ?.value;
  }

  @computed
  get operations(): RightOperationItemProps[] {
    const { configure } = this.props;
    const operations = [];
    const { layoutStore, Languages, Notice, Debuger, Environment } = this.props;

    this.MALL_URL &&
      operations.push({
        title: "商城",
        icon: <Icon type="shop" />,
        onClick: () => window.open(this.MALL_URL, "_blank"),
      });

    configure.Debug &&
      operations.push({
        title: intl.get("debug").d("debug"),
        icon: <Debuger />,
      });

    configure.Search &&
      operations.push({
        title: intl.get("搜索").d("搜索"),
        icon: <Icon type="search" />,
        onClick: () => (layoutStore.featureStatus["GlobalSearch"] = "Show"),
      });

    if (configure.Notification) {
      const ref = React.createRef<typeof Notice>();
      operations.push({
        title: intl.get("消息").d("消息"),
        icon: <Notice forwardRef={ref} />,
        onClick: () => {
          ref.current?.goNoticeManage();
        },
      });
    }

    return operations;
  }

  @computed
  get userInfo(): string {
    const {
      configure: { UserInfo },
      globalStore,
    } = this.props;
    const { current = {} } = globalStore;
    // 环境变量取不到，默认
    if (!UserInfo) {
      const { current = {} } = globalStore;
      const { nickname, username, mobile } = current;
      return nickname || username || mobile || "";
    }
    // 模板字符串替换, $1 为 key
    return UserInfo.replaceAll(/{{(\s?\w+\s?)}}/g, ($0, $1) => current[$1]);
  }

  // 用户中心配置
  @computed
  get userMenu(): UserMenuProps {
    const { globalStore, Languages } = this.props;
    const { current = {} } = globalStore;

    const userinfo = this.userInfo;

    const SwitchLanguage = () => (
      <Languages>
        <div className="user-center-list">
          <div style={{ display: "flex" }}>
            <div>
              <Icon type="earth" />
            </div>
            <span style={{ marginTop: 8 }}>
              {intl.get("语言切换").d("语言切换")}
            </span>
          </div>
          <Icon type="right" />
        </div>
      </Languages>
    );
    const operations = [
      {
        title: (
          <div>
            <Icon type="close-circle" />
            <span>{intl.get("退出登录").d("退出登录")}</span>
          </div>
        ),
        onClick: this.handleLogout,
      },
    ];
    if (this.props.configure.Language) {
      operations.unshift({
        title: <SwitchLanguage />,
        onClick: null,
      });
    }
    return {
      name: (<span onClick={this.handleUser}>{userinfo}</span>) as any,
      avatar: {
        src: current.avatar,
      },
      // @ts-ignore
      operations,
    };
  }

  // 当前应用信息
  @computed
  get application() {
    const { layoutStore, globalStore } = this.props;
    if (!layoutStore.applicationKey) return null;
    return globalStore.applicationsDict[layoutStore.applicationKey] || null;
  }

  // 获取当前主题
  get theme(): Theme {
    return this.props.configure.featureResolve("GLOBAL_THEME_NORMAL", false)
      ? Theme.NORMAL
      : Theme.LIGHT;
  }

  public horizontalAppcenterCenterRef = React.createRef<HTMLDivElement>();
  public get $horizontalAppcenterCenter() {
    return this.horizontalAppcenterCenterRef?.current;
  }

  public horizontalAppcenterMoreRef = React.createRef<HTMLDivElement>();
  public get $horizontalAppcenterMore() {
    return this.horizontalAppcenterMoreRef?.current;
  }

  public horizontalAppcenterDropRef = React.createRef<HTMLDivElement>();
  public get $horizontalAppcenterDropRef() {
    return this.horizontalAppcenterDropRef?.current;
  }

  public resizeObserver: ResizeObserver;

  public componentDidMount() {
    // if (this.props.layout !== 'horizontal') return;
    // this.resizeObserver = new ResizeObserver(this.handleResize);
    // this.resizeObserver.observe(this.$horizontalAppcenterCenter);
    // this.resizeObserver.observe(document.body);
    if (this.WEBNEST_THEME) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.type = "text/css";
      cssLink.href = this.WEBNEST_THEME;
      document.head.appendChild(cssLink);
    }
  }

  public componentWillUnmount() {
    // if (this.props.layout !== 'horizontal') return;
    // if (this.resizeObserver) {
    //   this.resizeObserver.unobserve(this.$horizontalAppcenterCenter);
    //   this.resizeObserver.unobserve(document.body);
    // }
  }

  public componentDidUpdate(prevProps) {
    // if (
    //   get(prevProps, 'location.pathname') !==
    //   get(this.props, 'location.pathname') &&
    //   this.props.layout === 'horizontal'
    // ) {
    //   this.handleResize();
    // }
  }

  @action
  public handleResize = () => {
    const $appcenter = this.$horizontalAppcenterCenter;
    const $more = this.$horizontalAppcenterMore;
    const $dropRef = this.$horizontalAppcenterDropRef;
    const appcenterRect: DOMRect = $appcenter.getBoundingClientRect();
    const items = $appcenter.querySelectorAll("a");

    const { layoutStore, globalStore } = this.props;
    const { applicationKey } = layoutStore;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      if (
        appcenterRect.right < itemRect.right &&
        item.style.visibility !== "hidden"
      ) {
        return (item.style.visibility = "hidden");
      } else if (
        appcenterRect.right >= itemRect.right &&
        item.style.visibility !== "visible"
      ) {
        item.style.visibility = "visible";
      }
    });

    const latest = findIndex(items, (item) => {
      return item.style.visibility === "hidden";
    });

    if (latest >= 0) {
      const latestItem = items[latest];
      const latestRect = latestItem.getBoundingClientRect();
      $more.style.left = latestRect.left - appcenterRect.right + "px";
      $more.style.visibility = "visible";

      $dropRef.style.maxHeight =
        document.body.clientHeight - appcenterRect.height * 2 + "px";
      $dropRef.style.overflowY = "auto";
    } else {
      $more.style.left = "0px";
      $more.style.visibility = "hidden";

      $dropRef.style.maxHeight = "none";
    }

    const mores = ($more.querySelectorAll(
      ".dropdown-content span"
    ) as unknown) as HTMLSpanElement[];
    if (latest >= 0) {
      mores.forEach((item, index) => {
        index < latest
          ? (item.style.display = "none")
          : (item.style.display = "block");
      });
    }
    const $active = (find(mores, (item) => {
      return item.getAttribute("data-key") === applicationKey;
    }) as unknown) as HTMLSpanElement;
    const $moreSelected = $more.querySelector<HTMLDivElement>(
      ".appcenter-horizontal-item"
    );
    if ($active && $active.style.display !== "none") {
      $moreSelected.style.display = "block";
      $moreSelected.innerText = this.application.name;
    } else {
      $moreSelected.innerText = "";
      $moreSelected.style.display = "none";
    }
  };

  public handleBlur = () => {
    const $more = this.$horizontalAppcenterMore.querySelector("a");
    // @ts-ignore
    $more.blur();
  };

  @action
  public handleApplication = (application: any) => {
    const { onApplication } = this.props;
    onApplication(application);
  };

  public handleUser = (e: React.MouseEvent) => {
    const { history, Environment, tabbars } = this.props;
    const { UC_FRONT_URL, UC_BACK_URL } = Environment;
    if (this.timer) clearTimeout(this.timer);
    this.clicks++;
    this.timer = setTimeout(() => {
      if (this.clicks === 1) {
        tabbars.open({
          path: "/frame",
          payload: { link: `//${UC_BACK_URL || UC_FRONT_URL}/account` },
          options: { _tab_title: intl.get("用户中心").d("用户中心") },
        });
      }
      if (this.clicks >= 3) {
        this.setState({
          versionVisible: !this.state.versionVisible,
        });
      }
      this.clicks = 0;
    }, 300);
  };

  public handleLogout = () => {
    const { globalService } = this.props;

    if (size(encodeURIComponent(location.href)) >= 4000) {
      message.warning(
        intl
          .get("当前URL过长，再次登录将返回首页")
          .d("当前URL过长，再次登录将返回首页")
      );
      return (window.location.href = globalService.getLogoutAddr(
        window.location.origin
      ));
    }
    window.location.href = globalService.getLogoutAddr();
  };

  @computed
  public get globalNavigationProps(): NGlobalNavigationProps {
    const {
      globalStore,
      layoutStore,
      GlobalAppstore,
      configure,
      location,
    } = this.props;
    const layout = this.layout;
    const slotItems = [
      // configure.featureResolve('DASHBOARD', false) && (
      //   <DashboardEntry active={location.pathname === '/'} theme={this.theme === Theme.LIGHT ? 'light' : 'default' } onClick={this.props.onDashboardEntryClick} />
      // ),
      // layout === 'vertical' && (
      // <GlobalAppstore list={globalStore.list} theme={this.theme} onClick={this.handleApplication} />
      // ),
    ].filter(Boolean);
    return {
      // appName:
      //   layout === "vertical"
      //     ? "Trantor"
      //     : (((
      //         <Fragment>
      //           <div
      //             className="overwite-horizontal-appcenter"
      //             ref={this.horizontalAppcenterCenterRef}
      //           >
      //             {globalStore.applications.map((application) => {
      //               const { name, key } = application;
      //               return (
      //                 <a
      //                   key={key}
      //                   data-key={key}
      //                   onClick={() => {
      //                     this.handleApplication(application);
      //                   }}
      //                   className={cx("appcenter-horizontal-item", {
      //                     active: key === layoutStore.applicationKey,
      //                   })}
      //                 >
      //                   {name}
      //                 </a>
      //               );
      //             })}
      //           </div>
      //           <div
      //             className="overwrite-dropdown-more"
      //             ref={this.horizontalAppcenterMoreRef}
      //           >
      //             <span className="appcenter-horizontal-item active"></span>
      //             <a href="javascript:;" tabIndex={0}>
      //               <Icon type="double-right" />
      //               <div
      //                 className="dropdown-content"
      //                 ref={this.horizontalAppcenterDropRef}
      //               >
      //                 {globalStore.applications.map((application) => {
      //                   const { name, key } = application;
      //                   return (
      //                     <span
      //                       key={key}
      //                       data-key={key}
      //                       onClick={() => {
      //                         this.handleBlur();
      //                         this.handleApplication(application);
      //                       }}
      //                       className={cx({
      //                         active: key === layoutStore.applicationKey,
      //                       })}
      //                     >
      //                       {name}
      //                     </span>
      //                   );
      //                 })}
      //               </div>
      //             </a>
      //           </div>
      //         </Fragment>
      //       ) as unknown) as string),
      appName:
        layout === "vertical"
          ? "Trantor"
          : (((configure.featureResolve("DASHBOARD", false) ? (
              <div
                className="override-global-navigation-dashboard-entry"
                onClick={this.props.onDashboardEntryClick}
              >
                <Icon type="data-store" theme="filled" />
                <span>工作台</span>
              </div>
            ) : (
              ""
            )) as unknown) as string),
      layout,
      theme: this.theme,
      lightHorizontalBrandIcon: null,
      slot: slotItems.length
        ? {
            element: (
              <Space direction={layout} size={16}>
                {slotItems}
              </Space>
            ),
          }
        : undefined,
    };
  }

  handleVersionClose = () => {
    this.setState({
      versionVisible: !this.state.versionVisible,
    });
  };

  render() {
    const {
      GlobalAppstore,
      layoutStore,
      globalStore,
      onApplication,
      configure,
    } = this.props;

    const { versionVisible } = this.state;
    const verticalBrandIcon = this.application ? (
      <a className="global-navigation-icon">
        <span>
          {this.application.icon ? (
            <Icon type={this.application.icon} />
          ) : (
            this.application.name[0].toLocaleUpperCase()
          )}
        </span>
      </a>
    ) : null;
    const logo =
      configure.Logo === null ? (
        <div style={{ height: "100%", width: 120 }} />
      ) : configure.Logo ? (
        <img src={configure.Logo} height="100%" />
      ) : null;

    return [
      <NGlobalNavigation
        key="global-navigation"
        {...this.globalNavigationProps}
        lightVerticalBrandIcon={verticalBrandIcon}
        verticalBrandIcon={verticalBrandIcon}
        horizontalBrandIcon={
          logo || (
            <img
              src={require("@terminus/t-workspace/lib/assets/logo-normal.png")}
              height="47"
            />
          )
        }
        lightHorizontalBrandIcon={
          logo || (
            <img
              src={require("@terminus/t-workspace/lib/assets/logo-light.png")}
              height="47"
            />
          )
        }
        layout={this.layout}
        operations={this.operations}
        userMenu={this.userMenu}
      />,
      versionVisible && (
        <VersionInfo
          visible={versionVisible}
          onClose={this.handleVersionClose}
          {...(this.props as any)}
        />
      ),
    ];
  }
}

@(TModule("GlobalNavigation").Options({ type: "Component", isPrimary: true }))
@InjectModules([
  "configure",
  "tabbars",
  "globalService",
  "globalStore",
  "layoutStore",
  "GlobalAppstore",
  "Languages",
  "Notice",
  "Debuger",
  "Environment",
  "Notice",
])
// @ts-ignore
@withRouter
@observer
export class GlobalNavigationInject extends GlobalNavigationOverwrite {}
