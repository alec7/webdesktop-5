package models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import play.data.validation.Required;
import play.db.jpa.GenericModel;

@Entity
@Table(name = "tb_appmodule")
public class AppModuleBean extends GenericModel {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	public String id;
	@Required
	public String appId;
	@Required
	public String moduleId;
	@Required
	public int orderNo = Integer.MAX_VALUE;

	public AppModuleBean() {
	}

	@Override
	public String toString() {
		return "AppModuleBean{" +
				"appId='" + appId + '\'' +
				", moduleId='" + moduleId + '\'' +
				'}';
	}
}
