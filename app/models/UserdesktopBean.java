package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;
import play.data.validation.Required;
import play.db.jpa.GenericModel;
import utils.cache.DesktopCache;
import utils.exception.DesktopException;
import utils.json.DesktopJson;
import utils.json.ModuleJson;
import utils.json.PageJson;

/**
 * 用户桌面对象
 */
@Entity
@Table(name = "tb_userdesktop")
public class UserdesktopBean extends GenericModel {
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	public String id;
	@Required
	public String themeId;
	public String userId = "-1";
	public String desktopJsonData;
	@Transient
	public String stationId;

	//视图属性，非持久化属性
	@Transient
	public String desktopJsonDataView;

	public UserdesktopBean() {
		this.desktopJsonData = "{\"pages\":[{pageno:\"1\",\"modules\":[]}]}";
		this.themeId = "1";
		this.userId = "-1";
	}

	private boolean existModule(PageJson pageJson, String id) {
		for (ModuleJson mj : pageJson.getModules())
			if (mj.getId().equals(id))
				return true;
		return false;
	}

	public void uninstallModule(String pageno, ModuleBean module) {
		desktopJsonData = desktopJsonData.replace("\\", "");
		DesktopJson desktopJson = buildDesktopJson(desktopJsonData);
		for (PageJson page : desktopJson.getPages()) {
			if (page.getPageno().equals(pageno)) {
				for (ModuleJson mj : page.getModules()) {
					if (mj.getId().equals(module.id)) {
						page.getModules().remove(mj);
						break;
					}
				}
				break;
			}
		}

		desktopJsonData = toJsonString(desktopJson);
		desktopJsonDataView = null;
	}

	public void AddModule(String pageno, ModuleBean module) {

		desktopJsonData = desktopJsonData.replace("\\", "");

		DesktopJson desktopJson = buildDesktopJson(desktopJsonData);
		ModuleJson moduleJson = null;
		for (PageJson page : desktopJson.getPages()) {
			if (page.getPageno().equals(pageno)) {
				if (existModule(page, module.id))
					throw new DesktopException("该模块在桌面上已经存在,不能重复添加");

				moduleJson = new ModuleJson(module.id);
				page.getModules().add(moduleJson);
				break;
			}
		}
		if (moduleJson == null) {
			PageJson pageJson = new PageJson(pageno);
			desktopJson.getPages().add(pageJson);
			moduleJson = new ModuleJson(module.id);
			pageJson.getModules().add(moduleJson);
		}

		desktopJsonData = toJsonString(desktopJson);
		desktopJsonDataView = null;
	}

	private void copyproperties(ModuleBean sModule, ModuleJson dModule) {
		dModule.setAlign(sModule.align);
		dModule.setCode(sModule.code);
		dModule.setDraggable(sModule.draggable);
		dModule.setHeight(sModule.height);
		dModule.setIcon(sModule.icon);
		dModule.setMaxHeight(sModule.maxHeight);
		dModule.setMaximize(sModule.maximize);
		dModule.setMaxWidth(sModule.maxWidth);
		dModule.setMinHeight(sModule.minHeight);
		dModule.setMinimize(sModule.minimize);
		dModule.setMinWidth(sModule.minWidth);
		dModule.setUrl(sModule.url);
		dModule.setName(sModule.name);
		dModule.setRemark(sModule.remark);
		dModule.setResizeable(sModule.resizeable);
		dModule.setValign(sModule.valign);
		dModule.setWidth(sModule.width);
	}

	private DesktopJson convertJsonToObj(String desktopJsonData) {
		//将moduleJson转成bean对象
		desktopJsonData = desktopJsonData.replace("\\", "");
		DesktopJson desktopJson = buildDesktopJson(desktopJsonData);
		List<PageJson> pages = desktopJson.getPages();
		for (PageJson page : pages) {
			List<ModuleJson> moduleJsons = page.getModules();
			List<ModuleJson> rtnJsons = new ArrayList<ModuleJson>();
			for (ModuleJson moduleJson : moduleJsons) {
				String moduleId = moduleJson.getId();
				ModuleBean module = DesktopCache.getModule(moduleId);
				if (module == null)
					continue;
				if (module.isShow == 0)
					continue;
				//TODO:目前不需要权限校验
//				if (module.visiable == 1) {
//					//需要进行权限校验
//					if ( module.userIds == null || "".equals(module.userIds))
//						continue;
//					if ( module.userIds.indexOf(stationId) < 0 )
//						continue;
//				}
				copyproperties(module, moduleJson);
				rtnJsons.add(moduleJson);
			}
			page.setModules(rtnJsons);
		}
		return desktopJson;
	}

	private final DesktopJson buildDesktopJson(String desktopJsonData) {
		return new Gson().fromJson(desktopJsonData, DesktopJson.class);
	}

	public String getDesktopJsonView() {
		DesktopJson desktopJson = convertJsonToObj(desktopJsonData);
		desktopJsonDataView = toJsonString(desktopJson).replace("\\", "");
		return desktopJsonDataView;
	}

	private final String toJsonString(DesktopJson desktopJson) {
		return new Gson().toJson(desktopJson);
	}
}
