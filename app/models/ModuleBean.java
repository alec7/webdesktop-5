package models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import play.data.validation.Max;
import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.GenericModel;

@Entity
@Table(name = "tb_module")
public class ModuleBean extends GenericModel {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	public String id;
	@Required
	public String name;
	public String code;
	@MaxSize(value = 100)
	public String icon;
	@MaxSize(value = 500)
	public String remark;
	@MaxSize(value = 100)
	public String url;
	@Max(value = Float.MAX_VALUE)
	public Float width;
	@Max(value = Float.MAX_VALUE)
	public Float height;
	@Max(value = Float.MAX_VALUE)
	public Float maxWidth;
	@Max(value = Float.MAX_VALUE)
	public Float maxHeight;
	@Max(value = Float.MAX_VALUE)
	public Float minWidth;
	@Max(value = Float.MAX_VALUE)
	public Float minHeight;

	public int draggable = 1;
	public int resizeable = 1;
	public int minimize = 1;
	public int maximize = 1;
	public String align;
	public String valign;
	//0：不显示，1：显示；默认显示
	public int visiable = 1;
	public String userIds;
	public String userNames;
	//0：不显示，1：显示；默认显示
	public int isShow = 1;

	public ModuleBean() {
	}

	public ModuleBean(String name, String url) {
		this.name = name;
		this.url = url;
	}

	@Override
	public String toString() {
		return "ModuleBean{" +
				"url='" + url + '\'' +
				", name='" + name + '\'' +
				'}';
	}
}
