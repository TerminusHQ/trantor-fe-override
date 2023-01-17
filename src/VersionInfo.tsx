import React from "react";
import { Modal } from "@terminus/nusi";
import classNames from "classnames/bind";
import intl from "@terminus/i18n-plat-sdk-js";
// @ts-ignore
import styles from "./index.scss";
// @ts-ignore
import TrantorLogo from "./assets/Trantor.svg";

const cx = classNames.bind(styles);

type IProps = {
  onClose: () => void;
  globalService: any;
  Environment: Record<string, string>;
  visible: boolean;
};

const pkgsNameMap = {
  nusi: "Nusi",
  "nusi-engine": "Nusi-Engine",
  "nusi-components": "Nusi-Components",
  antd: "Antd",
  "i18n-plat-sdk-js": "i18nSDK",
};

const ModalVersion = (props: IProps) => {
  const {
    globalService: { getFrontVersions, getBackVersions },
    visible,
    onClose,
    Environment,
  } = props;
  const [loading, setLoading] = React.useState(false);
  const [versions, setVersions] = React.useState({});

  React.useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setLoading(true);
    const [_frontVersions = {}, backVersions = {}] = await Promise.all([
      getFrontVersions(),
      getBackVersions(),
    ]);
    let frontVersions = {
      Workspace: Environment?.TRANTOR_IMAGE?.includes(":")
        ? Environment?.TRANTOR_IMAGE?.split(":")?.[1]
        : Environment?.TRANTOR_IMAGE,
    };
    Object.entries(pkgsNameMap).forEach(([rawName, name]) => {
      for (let key in _frontVersions) {
        let _name = key.includes("/") ? key.split("/")[1] : key;
        if (rawName === _name) {
          frontVersions[name] = _frontVersions[key];
        }
      }
    });
    setVersions((prev) => ({
      ...prev,
      ...backVersions,
      ...frontVersions,
    }));
    setLoading(false);
  };

  const handleCancel = () => {
    onClose();
  };

  const content = React.useMemo(
    () => (
      <>
        <div className="version-modal-content">
          <div className="version-modal-content-left">
            <embed src={TrantorLogo} type="image/svg+xml" />
          </div>
          <div className="version-modal-content-right">
            <span style={{ fontWeight: 600 }}>
              {intl.get("当前版本").d("当前版本")}:
            </span>
            {Object.entries(versions).map(
              ([name, version]: [string, string], index) => (
                <div
                  className={`version-modal-content-right-${
                    name !== "Trantor Framework" ? "title" : "mainTitle"
                  }`}
                  style={{ marginTop: name === "Workspace" ? 18 : 0 }}
                  key={index}
                >
                  {index !== 0 && <i />}
                  <span className="version-modal-content-right-name">
                    {name}:
                  </span>
                  <span
                    className={`version-modal-content-right-${
                      name !== "Trantor Framework" ? "content" : "mainContent"
                    }`}
                  >
                    {" "}
                    {version}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </>
    ),
    [versions]
  );

  return !loading ? (
    <Modal
      visible={visible}
      title={intl.get("当前版本信息").d("当前版本信息")}
      footer={null}
      closable={true}
      wrapClassName={cx("versionModal")}
      onCancel={handleCancel}
      mask={false}
      width={640}
    >
      {content}
    </Modal>
  ) : null;
};

export default ModalVersion;
