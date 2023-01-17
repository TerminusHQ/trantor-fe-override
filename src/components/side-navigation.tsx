import React from "react";
import { Icon, SideNavigation as NSideNavigation } from "@terminus/nusi";
import { Dropdown, Tooltip, Typography } from "antd";
import { toArray } from "lodash";
import cs from "classnames";
import "./index.scss";
import "./menu.scss";
const ITEM_HEIGHT = 40;
interface SideNavigationProps {
  appStore: React.ReactNode;
  dataSource: Array<{
    key: string;
    icon: string;
    title: string;
    children?: SideNavigationProps["dataSource"];
  }>;
  header: { header: React.ReactNode };
  onTitleClick: (props: { openKeys: string[] }) => void;
  openKeys: string[];
  linkRender: (
    link: string,
    children: React.ReactNode,
    menu: SideNavigationProps["dataSource"][number]
  ) => React.ReactNode;
  selectedKey: string;
}

const SideNavigation = React.forwardRef<any, SideNavigationProps>(
  (props, ref) => {
    const {
      appStore,
      dataSource,
      header,
      onTitleClick,
      openKeys,
      linkRender,
      selectedKey,
    } = props;
    const [folded, setFolded] = React.useState(() =>
      dataSource.length > 0 ? false : true
    );
    const domRef = React.useRef<HTMLDivElement>(null);
    const openKeysRef = React.useRef(openKeys);

    React.useImperativeHandle(
      ref,
      () => {
        return {
          open: () => setFolded(false),
          close: () => setFolded(true),
        };
      },
      []
    );

    React.useEffect(() => {
      openKeysRef.current = openKeys;
    }, [openKeys]);

    React.useEffect(() => {
      if (dataSource.length === 0) {
        setFolded(true);
      }
    }, [dataSource.length]);

    React.useEffect(() => {
      if (folded || !domRef.current || !selectedKey) {
        return;
      }
      const targetDom = domRef.current.querySelector(`#${selectedKey}`);
      targetDom?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, [selectedKey, folded]);

    const isActiveIcon = (key: string) => {
      const includesSelectedKey = (item: any) => {
        if (item.key === selectedKey) return true;
        return (
          item.children.length > 0 &&
          item.children.some((d) => includesSelectedKey(d))
        );
      };
      return dataSource.find(includesSelectedKey)?.key === key;
    };

    const onMenuClickOnIcon = React.useCallback(
      (key: string) => {
        const openKeySet = new Set(openKeysRef.current);
        if (openKeySet.has(key)) {
          openKeySet.delete(key);
        } else {
          openKeySet.add(key);
        }
        onTitleClick({ openKeys: toArray(openKeySet) });
      },
      [onTitleClick]
    );

    return (
      <div
        ref={domRef}
        className={cs("side-navigation", {
          "side-navigation_folded": folded,
        })}
      >
        <div className="side-navigation__icon-col">
          <div className="side-navigation__icon-col__app-icon">{appStore}</div>
          <div className="side-navigation__icon-col__menu-icons">
            {dataSource
              .filter((d) => d.icon)
              .map((d) => {
                return (
                  <MenuIcon
                    key={d.key}
                    folded={folded}
                    isActive={isActiveIcon(d.key)}
                    item={d}
                    linkRender={linkRender}
                    onClick={onMenuClickOnIcon}
                  />
                );
              })}
          </div>
        </div>
        <div className="side-navigation__menu-col">
          <div className="side-navigation__menu-col__header">
            {folded ? null : header.header}
          </div>
          <div className="side-navigation__menu-col__menu">
            {dataSource.map((d) => {
              return (
                <MenuItem
                  key={d.key}
                  item={d}
                  onTitleClick={onTitleClick}
                  openKeys={openKeys}
                  linkRender={linkRender}
                  selectedKey={selectedKey}
                />
              );
            })}
          </div>
        </div>

        {dataSource.length > 0 && (
          <div
            className={cs("side-navigation__fold-btn", {
              "side-navigation__fold-btn_folded": folded,
            })}
            onClick={() => setFolded((f) => !f)}
          >
            <Icon type="fold-left" />
          </div>
        )}
      </div>
    );
  }
);

interface MenuItemProps
  extends Pick<
    SideNavigationProps,
    "onTitleClick" | "openKeys" | "linkRender"
  > {
  item: SideNavigationProps["dataSource"][number];
  index?: number;
  selectedKey: string;
}

const MenuItem = ({
  item,
  index = 0,
  openKeys,
  onTitleClick,
  linkRender,
  selectedKey,
}: MenuItemProps) => {
  const { children = [], key } = item;
  /**
   * 0 未开始
   * 1 初始化
   * 2 过度中
   * 3 过度完成
   */
  const [transitingStatus, setTransitingStatus] = React.useState(0);
  const subMenuRef = React.useRef<HTMLDivElement>(null);
  const openKeysRef = React.useRef(openKeys);

  const isOpen = openKeys.includes(key);

  React.useEffect(() => {
    openKeysRef.current = openKeys;
  }, [openKeys]);

  const style = React.useMemo<React.CSSProperties>(() => {
    if (children.length === 0 || (transitingStatus === 0 && !isOpen)) {
      return {
        display: "none",
      };
    }
    // 打开
    if (isOpen) {
      if (transitingStatus === 1) {
        return {
          display: "block",
          opacity: 0,
          height: 0,
        };
      }
      if (transitingStatus === 2) {
        return {
          display: "block",
          opacity: 1,
          height: children.length * ITEM_HEIGHT,
        };
      }
    }

    // 关闭
    if (!isOpen) {
      if (transitingStatus === 1) {
        return {
          opacity: 1,
          height: subMenuRef.current.getBoundingClientRect().height,
        };
      }
      if (transitingStatus === 2) {
        return {
          opacity: 0,
          height: 0,
        };
      }
    }

    // 过渡完成
    if (transitingStatus === 3) {
      return {
        display: isOpen ? undefined : "none",
      };
    }
  }, [children.length, isOpen, transitingStatus]);

  const onTransitionEnd = () => {
    setTransitingStatus(3);
  };

  const isSelected = selectedKey === item.key;

  const titleNode = React.useMemo(
    () => (
      <div
        className={cs("side-navigation-menu-item__title", {
          "side-navigation-menu-item__title_opened": isOpen,
          "side-navigation-menu-item__title_selected": isSelected,
        })}
        onMouseDown={() => {
          if (children.length === 0) return;
          const openKeySet = new Set(openKeysRef.current);
          if (openKeySet.has(key)) {
            openKeySet.delete(key);
          } else {
            openKeySet.add(key);
          }
          onTitleClick({ openKeys: toArray(openKeySet) });
          setTransitingStatus(1);
        }}
        onMouseUp={() => {
          setTransitingStatus(2);
        }}
      >
        <div>
          <div
            className="side-navigation-menu-item__title__text"
            style={{ paddingLeft: index > 0 ? 16 : undefined }}
          >
            {linkRender(
              "",
              <Typography.Text ellipsis={{ tooltip: true }}>
                {item.title}
              </Typography.Text>,
              item
            )}
          </div>
          {children.length > 0 && (
            <div className="side-navigation-menu-item__title__expand-icon">
              <Icon type="down" />
            </div>
          )}
        </div>
      </div>
    ),
    [
      linkRender,
      index,
      item.title,
      item.key,
      children.length,
      isSelected,
      isOpen,
    ]
  );

  return (
    <div
      className={`side-navigation-menu-item side-navigation-menu-item-${index}`}
      id={item.key}
    >
      {titleNode}
      <div
        ref={subMenuRef}
        className="side-navigation-menu-item__submenu"
        onTransitionEnd={onTransitionEnd}
        style={style}
      >
        {item.children.map((c) => {
          return (
            <MenuItem
              key={c.key}
              item={c}
              onTitleClick={onTitleClick}
              openKeys={openKeys}
              index={index + 1}
              linkRender={linkRender}
              selectedKey={selectedKey}
            />
          );
        })}
      </div>
    </div>
  );
};

interface MenuIconProps {
  isActive: boolean;
  linkRender: (
    link: string,
    children: React.ReactNode,
    menu: SideNavigationProps["dataSource"][number]
  ) => React.ReactNode;
  item: SideNavigationProps["dataSource"][number];
  folded: boolean;
  onClick: (key: string) => void;
}

const MenuIcon = React.memo((props: MenuIconProps) => {
  const { isActive, item, linkRender, folded, onClick } = props;

  return (
    <div
      className={cs("side-navigation__icon-col__menu-icon", {
        "side-navigation__icon-col__menu-icon_active": isActive,
      })}
    >
      <Tooltip
        trigger={["hover", "click"]}
        title={item.title}
        placement="right"
      >
        {!folded ? (
          <Icon type={item.icon} />
        ) : (
          <Dropdown
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            trigger={["click"]}
            menu={{
              items: item.children.map((it) => ({
                ...it,
                label: linkRender("", it.title, it),
                onClick: () => {
                  onClick(item.key);
                },
                children: it.children.length ? it.children : undefined,
              })),
            }}
          >
            <Icon type={item.icon} />
          </Dropdown>
        )}
      </Tooltip>
    </div>
  );
});

export default SideNavigation;
