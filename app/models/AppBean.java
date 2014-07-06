package models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.GenericGenerator;
import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.GenericModel;

@Entity
@Table(name = "tb_app")
public class AppBean extends GenericModel {
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	public String id;
	@Required
	public String name;
	@Required
	public int orderNo;
	@MaxSize(value = 500)
	public String remark;
	@Transient
	public List<ModuleBean> modules = new ArrayList<ModuleBean>();
	//0：不显示，1：显示；默认显示
	@Required
	public int isShow = 1;

	public AppBean() {
	}

	public AppBean(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "AppBean{" +
				"name='" + name + '\'' +
				'}';
	}
}
