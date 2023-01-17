import React, { ReactNode } from "react";
import { InjectModules, TModule } from "@terminus/trantor-framework";
import { computed, reaction, action } from "mobx";
import { observer } from "mobx-react";
import { noop, omit, size } from "lodash";
// import { SideNavigation as NSideNavigation } from "@terminus/nusi";
import NSideNavigation from "./components/side-navigation";
import {
  SideNavigationProps,
  MenuConfigItemProps,
} from "@terminus/nusi/es/side-navigation/interface";
import { Theme } from "@terminus/nusi/es/global-navigation/interface";
import { GlobalStore, LayoutStore, Configure } from "@terminus/t-workspace";
import { GlobalAppstoreProps } from "@terminus/t-workspace/lib/routes/trantor.layout/GlobalAppstore";
import { Helmet } from "react-helmet";

export interface SideNavigationPropsType {
  globalStore: GlobalStore;
  layoutStore: LayoutStore;
  // 触发
  onApplication: (application: any) => void;
  onClick: (menu: any, options?: any) => void;
  configure: Configure;
  GlobalAppstore: React.ComponentClass<Partial<GlobalAppstoreProps>>;
}

export default class SideNavigation extends React.Component<
  SideNavigationPropsType
> {
  static defaultProps = {
    onClick: noop,
    onApplication: noop,
  };

  @computed
  public get application() {
    const { globalStore, layoutStore } = this.props;
    if (!layoutStore.applicationKey) return null;
    return globalStore.applicationsDict[layoutStore.applicationKey] || null;
  }

  @computed
  public get dataSource(): MenuConfigItemProps[] {
    const { globalStore, layoutStore } = this.props;
    if (!layoutStore.applicationKey) {
      return [];
    }
    const { applicationKey } = layoutStore;
    const application = globalStore.applicationsDict[applicationKey] || null;
    if (!application) return [];
    const menus = application.menus || [];
    return this.loopMenus(menus);
  }

  @computed get header() {
    const header = (
      <div className="side-navigation-header">
        <div className="side-navigation-title">
          {this.application && this.application.name}
        </div>
      </div>
    );
    return { header, headerIsFold: null };
  }

  public reactionDisposer;

  public state = {
    openKeys: null,
  };

  public get openKeys() {
    const { openKeys } = this.state;
    if (openKeys) return openKeys;
    const { layoutStore, configure } = this.props;
    if (!this.application) return;
    const { menus = [] } = this.application;

    if (configure.featureResolve("SIDE_OPENKEYS_ALL", false)) {
      return menus.map((menu) => menu.key);
    }

    return this.reverseOpenKeys(menus, [], [], layoutStore.menuKey);
  }

  public componentWillMount() {
    const { layoutStore } = this.props;
    this.reactionDisposer = reaction(
      () => layoutStore.applicationKey,
      (applicationKey) => {
        this.state.openKeys = null;
      }
    );
  }

  public componentWillUnmount() {
    this.reactionDisposer();
  }

  // 递归菜单
  public loopMenus = (menus: any[]): MenuConfigItemProps[] => {
    return menus.map((item) => {
      const { title, key, icon, leaf, children } = item;
      return {
        icon,
        title,
        key,
        leaf,
        data: omit(item, "children"),
        children: children ? this.loopMenus(children) : [],
      };
    });
  };

  // 反向展开菜单
  public reverseOpenKeys = (menus: any[], openKeys, memo, menuId) => {
    if (!menus || !menuId) return [];
    menus.some(({ children, leaf, key }) => {
      if (!leaf || size(children) > 0) {
        this.reverseOpenKeys(children, [...openKeys, key], memo, menuId);
        return false;
      }
      if (key === menuId) {
        return memo.push(openKeys);
      }
      return false;
    });
    return memo[0] || [];
  };

  // 打开菜单
  // public handleSpecialMenu = (menu: any)=>{
  //   const { onClick, layoutStore } = this.props;
  //   if( menu.data.routeKey === layoutStore.viewKey ) return onClick(menu.data, { pageState: { random: Math.floor(Math.random()*10000) } });
  //   onClick(menu.data);
  // }

  public sideNavigationProps: any = {
    // theme: Theme.LIGHT,
    dataSource: [],
    // size: 200,
    // compact: false,
    onTitleClick: ({ openKeys }) => {
      this.setState({ openKeys });
    },
    // 渲染跳转链接
    linkRender: (link: any, children: ReactNode, menu: any) => {
      if (menu.children && menu.children.length > 0) return children;
      return (
        <a
          onClick={() => {
            this.props.onClick(menu.data);
          }}
        >
          {children}
        </a>
      );
    },
  };

  // 生成浏览器标题
  @computed
  public get documentTitle() {
    const {
      layoutStore: { menuKey },
      globalStore: { menusDict },
    } = this.props;
    const currentMenu = menusDict[menuKey];
    return currentMenu ? currentMenu.title : "";
  }

  @action
  public handleApplication = (application: any) => {
    const { onApplication } = this.props;
    onApplication(application);
    this.navigationRef.current?.open()
  };

  // 获取当前主题
  get theme(): Theme {
    return this.props.configure.featureResolve("GLOBAL_THEME_NORMAL", false)
      ? Theme.NORMAL
      : Theme.LIGHT;
  }

  navigationRef = React.createRef<any>()

  render() {
    const { layoutStore, GlobalAppstore, globalStore } = this.props;
    const dataSource = this.dataSource;
    return (
      <>
        <Helmet>
          <title>{this.documentTitle}</title>
        </Helmet>
        {/*TODO: 搞菜单 */}
        <NSideNavigation
          {...this.sideNavigationProps}
          ref={this.navigationRef}
          selectedKey={layoutStore.menuKey}
          openKeys={this.openKeys}
          header={this.header}
          // searchBar={false}
          dataSource={layoutStore.applicationKey ? dataSource : ([] as any)}
          appStore={
            <GlobalAppstore
              list={globalStore.list}
              theme={this.theme}
              onClick={this.handleApplication}
            />
          }
        />
      </>
    );
  }
}

@(TModule("SideNavigation").Options({ type: "Component", isPrimary: true }))
@InjectModules(["configure", "globalStore", "layoutStore", "GlobalAppstore"])
@observer
export class SideNavigationInject extends SideNavigation {}
