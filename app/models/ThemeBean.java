package models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.GenericModel;

@Entity
@Table(name = "tb_theme")
public class ThemeBean extends GenericModel {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	public String id;
	@Required
	@MaxSize(value = 100)
	public String name;
	@MaxSize(value = 100)
	public String style;
	@MaxSize(value = 500)
	public String remark;

	public ThemeBean() {
	}

	public ThemeBean(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "ThemeBean{" +
				"name='" + name + '\'' +
				'}';
	}
}
