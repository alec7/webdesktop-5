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
@Table(name = "tb_icon")
public class IconBean extends GenericModel {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	public String id;
	@Required
	public String url;
	@MaxSize(value = 500)
	public String remark;

	public IconBean() {
	}

	public IconBean(String url) {
		this.url = url;
	}

	@Override
	public String toString() {
		return "IconBean{" +
				"url='" + url + '\'' +
				'}';
	}
}
