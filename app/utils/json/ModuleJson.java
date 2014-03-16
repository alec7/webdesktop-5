package utils.json;

public class ModuleJson implements java.io.Serializable {

	private String id;
	private String name;
	private String code;
	private String icon;
	private String remark;
	private String url;
	private Float width;
	private Float height;
	private Float maxWidth;
	private Float maxHeight;
	private Float minWidth;
	private Float minHeight;
	private int draggable;
	private int resizeable;
	private int minimize;
	private int maximize;
	private String align;
	private String valign;

	public ModuleJson() {
	}

	public ModuleJson(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Float getWidth() {
		return width;
	}

	public void setWidth(Float width) {
		this.width = width;
	}

	public Float getHeight() {
		return height;
	}

	public void setHeight(Float height) {
		this.height = height;
	}

	public Float getMaxWidth() {
		return maxWidth;
	}

	public void setMaxWidth(Float maxWidth) {
		this.maxWidth = maxWidth;
	}

	public Float getMaxHeight() {
		return maxHeight;
	}

	public void setMaxHeight(Float maxHeight) {
		this.maxHeight = maxHeight;
	}

	public Float getMinWidth() {
		return minWidth;
	}

	public void setMinWidth(Float minWidth) {
		this.minWidth = minWidth;
	}

	public Float getMinHeight() {
		return minHeight;
	}

	public void setMinHeight(Float minHeight) {
		this.minHeight = minHeight;
	}

	public String getAlign() {
		return align;
	}

	public void setAlign(String align) {
		this.align = align;
	}

	public String getValign() {
		return valign;
	}

	public void setValign(String valign) {
		this.valign = valign;
	}

	public int getDraggable() {
		return draggable;
	}

	public void setDraggable(int draggable) {
		this.draggable = draggable;
	}

	public int getResizeable() {
		return resizeable;
	}

	public void setResizeable(int resizeable) {
		this.resizeable = resizeable;
	}

	public int getMinimize() {
		return minimize;
	}

	public void setMinimize(int minimize) {
		this.minimize = minimize;
	}

	public int getMaximize() {
		return maximize;
	}

	public void setMaximize(int maximize) {
		this.maximize = maximize;
	}

}
