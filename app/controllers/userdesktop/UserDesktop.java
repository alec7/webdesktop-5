package controllers.userdesktop;

import com.google.gson.Gson;
import models.ModuleBean;
import models.UserdesktopBean;
import play.Logger;
import play.cache.Cache;
import play.mvc.Controller;
import utils.cache.DesktopCache;
import utils.exception.DesktopException;

/**
 * 创建人：xy
 * 创建时间：14-2-16
 *
 * @version 1.0
 */

public class UserDesktop extends Controller {
	public static void index() {
		UserdesktopBean userdesktop = getUserdesktop(getUser());
		render(userdesktop);
	}

	public static void addModule() {
		String pageno = params.get("pageno");
		String moduleId = params.get("moduleId");

		ModuleBean moduleBean = DesktopCache.getModule(moduleId);
		if (moduleBean == null) {
			Logger.error("该模块已经不存在了!");
			throw new DesktopException("该模块已经不存在了!");
		}
		UserdesktopBean userdesktop = getUserdesktop(getUser());
		userdesktop.AddModule(pageno, moduleBean);

		userdesktop.merge();

		String moduleJsonData = new Gson().toJson(moduleBean);
		renderJSON(moduleJsonData);
	}

	public static void uninstallModule() {
		String pageno = params.get("pageno");
		String moduleId = params.get("moduleId");

		UserdesktopBean userdesktop = getUserdesktop(getUser());
		ModuleBean moduleBean = DesktopCache.getModule(moduleId);
		if (moduleBean == null) {
			Logger.error("该模块已经不存在了");
			throw new DesktopException("该模块已经不存在了");
		}

		userdesktop.uninstallModule(pageno, moduleBean);

		userdesktop.merge();
	}

	/**
	 * 获取用户桌面数据
	 *
	 * @param userId
	 * @return
	 */
	private static final UserdesktopBean getUserdesktop(String userId) {
		UserdesktopBean userdesktop = DesktopCache.getUserdesktop(userId);
		if (userdesktop == null) {
			userdesktop = new UserdesktopBean();
		}
		return userdesktop;
	}

	private static final String getUser() {
		if (Cache.get("userId") == null) {
			return "-1";
		}
		return Cache.get("userId").toString();
	}
}
