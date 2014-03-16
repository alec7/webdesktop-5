package utils.json;

import java.util.ArrayList;
import java.util.List;

public class DesktopJson implements java.io.Serializable {
	List<PageJson> pages;

	public List<PageJson> getPages() {
		if (pages == null)
			pages = new ArrayList<PageJson>();
		return pages;
	}

	public void setPages(List<PageJson> pages) {
		this.pages = pages;
	}

}
