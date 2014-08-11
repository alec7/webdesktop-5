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

	public static void setTheme(String themeId) {
		if (null == themeId) {
			themeId = "2";
		}
		if (themeId.trim().equals("")) {
			themeId = "1";
		}
		/**更新操作**/
		UserdesktopBean.delete("userId = ?", getUser());
		UserdesktopBean userdesktop = new UserdesktopBean();
		userdesktop.themeId = themeId;
		userdesktop.userId = getUser();
		userdesktop.desktopJsonData = DesktopCache.getUserdesktop(getUser()).desktopJsonData;
		userdesktop.save();

		DesktopCache.initUserdesktops();
	}

	//todo：需要完善个人信息页面
	public static void myInfo(String userId) {
		if ("-1".equals(userId)) {
			render();
		}
	}

	/**
	 * 获取用户桌面数据
	 *
	 * @param userId
	 * @return
	 */
	private static final UserdesktopBean getUserdesktop(String userId) {
		return DesktopCache.getUserdesktop(userId);
	}

	private static final String getUser() {
		if (Cache.get("userId") == null) {
			return "-1";
		}
		return Cache.get("userId").toString();
	}
}
