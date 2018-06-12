/* アカウント一覧画面*/

var select_row;

var init_users_table = function() {
	var users_table = $('#users_table');
	var tbody = $(users_table).children('tbody')[0];
	for(var i = 0; i < users.length; i++) {
		var idx = 0;
		var rowCount = tbody.rows.length;
		var row = tbody.insertRow(rowCount);
		var num_cell = row.insertCell(idx++);
		num_cell.setAttribute("class", "text-center");
		num_cell.innerHTML = i + 1;

		var id_cell = row.insertCell(idx++);
		id_cell.setAttribute("class", "text-center");
		id_cell.innerHTML = users[i].user_name;

		var memo_cell = row.insertCell(idx++);
		memo_cell.innerHTML = users[i].memo;

		var permission_cell = row.insertCell(idx++);
		permission_cell.setAttribute("class", "text-center");
		var desc = "";
		var nums = users[i].permission.split("-");
		for(var j = 0; j < nums.length; j++) {
			for(var k = 0; k < permissions.length; k++) {
				if(permissions[k].id == nums[j]) {
					if(desc.length > 0) {
						desc += ", ";
					}
					desc += permissions[k].desc;
					break;
				}
			}
		}
		permission_cell.innerHTML = desc;

		var button_cell = row.insertCell(idx++);
		button_cell.setAttribute("class", "text-center");

		var btn_detail = document.createElement('button');
		btn_detail.setAttribute('class', 'btn');
		btn_detail.setAttribute('onclick', 'detail_row('+ users[i].id +');');
		dom_util.setClass(btn_detail, 'btn-info');
		dom_util.setClass(btn_detail, 'mg10r');
		dom_util.setClass(btn_detail, 'btn-sm');
		btn_detail.innerHTML = '<i class="glyphicon glyphicon-pencil"></i> 編集';

		var btn_del = document.createElement('button');
		btn_del.setAttribute('class', 'btn');
		btn_del.setAttribute('name', 'btn_delete');
		btn_del.setAttribute('onclick', 'delete_row(this);');
		dom_util.setClass(btn_del, 'btn-danger');
		dom_util.setClass(btn_del, 'btn-sm');
		btn_del.innerHTML = '<i class="glyphicon glyphicon-trash"></i> 削除';
		button_cell.appendChild(btn_detail);
		button_cell.appendChild(btn_del);
	}
};

var cur_row;
var delete_row = function(object) {
	cur_row = object;
};

var detail_row = function(id) {
	window.location.href = 'detail.html?id=' + id;
};

/** Modal Confirm 処理 **/
$(function() {
	/** 登録系（共通） **/
	$("#btn_save_add").click(function() {
		$("#txt_title").html("確認");
		$("#txt_msg").html("以下の内容を保存します。よろしいですか？");
		$("#dlg_ok_btn").click(function() {
			$("#dlg_confirm").modal("hide");	
		});
		$("#dlg_no_btn").click(function() {
		});
		$("#dlg_confirm").modal();
	});
	/** アカウント削除 **/
	$("[name='btn_delete']").click(function() {
		$("#txt_title").html("確認");
		$("#txt_msg").html("アカウント情報を削除します。よろしいですか？");
		$("#dlg_ok_btn").click(function() {
			$(cur_row).parent().parent().remove();
			$("#dlg_confirm").modal("hide");	
		});
		$("#dlg_no_btn").click(function() {
		});
		$("#dlg_confirm").modal();
	});
});