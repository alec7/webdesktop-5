package utils.cache;

import java.util.List;

import models.*;
import play.Logger;
import play.cache.Cache;

public class DesktopCache {

	public static void initUserdesktops() {
		try {
			List<UserdesktopBean> uds = UserdesktopBean.findAll();
			Cache.set("uds", uds);
			Logger.info("[缓存Userdesktop数量]：" + uds.size());
		} catch (Exception e) {
			Logger.error("初始化Userdesktop异常");
		}

	}

	public static void initThemes() {
		try {
			List<ThemeBean> themes = ThemeBean.findAll();
			Cache.set("themes", themes);
			Logger.info("[缓存Theme数量]：" + themes.size());
		} catch (Exception e) {
			Logger.error("初始化Theme异常");
		}
	}

	public static void initModules() {
		try {
			List<ModuleBean> modules = ModuleBean.findAll();
			Cache.set("modules", modules);
			Logger.info("[缓存Module数量]：" + modules.size());
		} catch (Exception e) {
			Logger.error("初始化Module异常");
		}
	}

	public static void initApps() {
		try {
			List<AppBean> apps = AppBean.find("from AppBean app order by app.orderNo").fetch();
			List<ModuleBean> modules = DesktopCache.getAllModules();
			List<AppModuleBean> appmodules = AppModuleBean.findAll();

			for (AppBean app : apps) {
				for (AppModuleBean appmodule : appmodules) {
					if (app.id.equals(appmodule.appId)) {
						for (ModuleBean module : modules) {
							if (appmodule.moduleId.equals(module.id)) {
								app.modules.add(module);
								break;
							}
						}
					}
				}
			}
			Cache.set("apps", apps);
			Logger.info("[缓存App数量]：" + apps.size());
		} catch (Exception e) {
			Logger.error("初始化App异常");
		}
	}

	public static void initIcons() {
		try {
			List<IconBean> icons = IconBean.findAll();
			Cache.set("icons", icons);
			Logger.info("[缓存Icon数量]：" + icons.size());
		} catch (Exception e) {
			Logger.error("初始化Icon异常");
		}

	}

	public static UserdesktopBean getUserdesktop(String userId) {
		List<UserdesktopBean> userdesktops = (List<UserdesktopBean>) Cache.get("uds");
		if (null != userdesktops) {
			for (UserdesktopBean userdesktop : userdesktops) {
				if (userId.equals(userdesktop.userId)) {
					return userdesktop;
				}
			}
		}
		return null;
	}

	public static void addUserdesktop(UserdesktopBean ud) {
		List<UserdesktopBean> userdesktops = (List<UserdesktopBean>) Cache.get("uds");
		userdesktops.add(ud);
		Cache.set("uds", userdesktops);
	}

	public static List<ThemeBean> getAllThemes() {
		List<ThemeBean> themes = (List<ThemeBean>) Cache.get("themes");
		return themes;
	}

	public static ThemeBean getTheme(String themeId) {
		List<ThemeBean> themes = (List<ThemeBean>) Cache.get("themes");
		for (ThemeBean theme : themes) {
			if (themeId.equals(theme.id)) {
				return theme;
			}
		}
		return null;
	}

	public static AppBean getApp(String appId) {
		List<AppBean> apps = (List<AppBean>) Cache.get("apps");
		for (AppBean app : apps) {
			if (appId.equals(app.id)) {
				return app;
			}
		}
		return null;
	}

	public static List<AppBean> getAllApps() {
		return (List<AppBean>) Cache.get("apps");
	}

	public static List<ModuleBean> getAllModules() {
		return (List<ModuleBean>) Cache.get("modules");
	}

	public static ModuleBean getModule(String moduleId) {
		List<ModuleBean> modules = (List<ModuleBean>) Cache.get("modules");
		for (ModuleBean module : modules) {
			if (moduleId.equals(module.id)) {
				return module;
			}
		}
		return null;
	}

	public static List<IconBean> getAllIcons() {
		return (List<IconBean>) Cache.get("icons");
	}

	public static IconBean getIcon(String iconId) {
		List<IconBean> icons = (List<IconBean>) Cache.get("icons");
		for (IconBean icon : icons) {
			if (iconId.equals(icon.id)) {
				return icon;
			}
		}

		return null;
	}
}
