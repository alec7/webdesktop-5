package utils.json;

import java.util.ArrayList;
import java.util.List;

public class PageJson implements java.io.Serializable {

	private String pageno;
	private List<ModuleJson> modules;

	public PageJson() {
	}

	public PageJson(String pageno) {
		this.pageno = pageno;
	}

	public String getPageno() {
		return pageno;
	}

	public void setPageno(String pageno) {
		this.pageno = pageno;
	}

	public List<ModuleJson> getModules() {
		if (modules == null)
			modules = new ArrayList<ModuleJson>();
		return modules;
	}

	public void setModules(List<ModuleJson> modules) {
		this.modules = modules;
	}

}
