package controllers.management;

import java.util.Iterator;
import java.util.List;

import models.AppBean;
import models.AppModuleBean;
import models.ModuleBean;
import org.apache.commons.lang.StringUtils;
import play.mvc.Controller;
import utils.cache.DesktopCache;

/**
 * 维护桌面应用的管理类
 * 创建人：xy
 * 创建时间：14-3-15
 *
 * @version 1.0
 */

public class AppManager extends Controller {

	public static void findApps() {
		List<AppBean> apps = DesktopCache.getAllApps();
		render(apps);
	}

	public static void show(String id) {
		AppBean app = DesktopCache.getApp(id);

		List<ModuleBean> modules = DesktopCache.getAllModules();

		//将此应用下的模块过滤掉,以便于页面上选择模块时不会重复选择
		Iterator<ModuleBean> _appModule = app.modules.iterator();
		Iterator<ModuleBean> _allModule = modules.iterator();
		while (_appModule.hasNext()) {
			ModuleBean m1 = _appModule.next();
			while (_allModule.hasNext()) {
				ModuleBean m2 = _allModule.next();
				if (m2.isShow == 0) {
					_allModule.remove();
				}
				if (m2 != null && m1.id.equals(m2.id)) {
					_allModule.remove();
				}
			}
		}

		render(app, _allModule);
	}

	public static void edit(AppBean app, String ids) {

		app.save();
		//先删除appModule，在根据ids重建appModule
		AppModuleBean.delete("appId = ?", app.id);
		if (StringUtils.isNotBlank(ids)) {
			String[] id = ids.split(",");
			for (int i = 0; i < id.length; i++) {
				ModuleBean module = DesktopCache.getModule(id[i]);
				AppModuleBean am = new AppModuleBean();
				am.appId = app.id;
				am.moduleId = module.id;
				am.orderNo = i + 1;
				am.save();
			}
		}
		//因为apps缓存依赖modules，所以还要刷新modules缓存
		DesktopCache.initModules();
		DesktopCache.initApps();

		show(app.id);
	}

}
