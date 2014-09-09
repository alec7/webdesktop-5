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

	public static UserdesktopBean getUserdesktop(String userId) {
		Object obj = Cache.get("uds");
		List<UserdesktopBean> userdesktops = null;
		if (obj == null) {
			initUserdesktops();
			userdesktops = (List<UserdesktopBean>) Cache.get("uds");
		} else {
			userdesktops = (List<UserdesktopBean>) obj;
		}
		for (UserdesktopBean userdesktop : userdesktops) {
			if (userId.equals(userdesktop.userId)) {
				return userdesktop;
			}
		}
		if (userdesktops.size() == 0) {
			return new UserdesktopBean();
		}
		return null;
	}

	public static List<ThemeBean> getAllThemes() {
		Object obj = Cache.get("themes");
		List<ThemeBean> themes;
		if (obj == null) {
			initThemes();
			themes = (List<ThemeBean>) Cache.get("themes");
		} else {
			themes = (List<ThemeBean>) obj;
		}
		return themes;
	}

	public static ThemeBean getTheme(String themeId) {
		List<ThemeBean> themes = getAllThemes();
		for (ThemeBean theme : themes) {
			if (themeId.equals(theme.id)) {
				return theme;
			}
		}
		return null;
	}

	public static AppBean getApp(String appId) {
		List<AppBean> apps = getAllApps();

		for (AppBean app : apps) {
			if (appId.equals(app.id)) {
				return app;
			}
		}
		return null;
	}

	public static List<AppBean> getAllApps() {
		List<AppBean> apps = null;
		Object obj = Cache.get("apps");
		if (null == obj) {
			initApps();
			apps = (List<AppBean>) Cache.get("apps");
		} else {
			apps = (List<AppBean>) obj;
		}
		return apps;
	}

	public static List<ModuleBean> getAllModules() {
		List<ModuleBean> modules = null;
		Object obj = Cache.get("modules");
		if (obj == null) {
			initModules();
			modules = (List<ModuleBean>) Cache.get("modules");
		} else {
			modules = (List<ModuleBean>) obj;
		}
		return modules;
	}

	public static ModuleBean getModule(String moduleId) {
		List<ModuleBean> modules = getAllModules();
		for (ModuleBean module : modules) {
			if (moduleId.equals(module.id)) {
				return module;
			}
		}
		return null;
	}

}
