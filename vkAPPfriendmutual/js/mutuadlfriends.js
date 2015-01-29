var id_app = [2866099, 4195289, 4195287, 4195284, 4161477, 4161462, 4149350, 4149349, 4149336, 2394133, 3043953];
var apiID_index = Math.floor(Math.random() * (id_app.length));
VK.init({
	apiId: id_app[apiID_index]
});
		

var user_ids =  [];
var user_ids_type =  [];
var friends = [];
var user_ids_count = [];
var count = 0;

function Del(user_id) {
	var obmen = false;
	for (var i=0; i<user_ids.length; i++) {
		if (user_ids[i] == user_id) obmen = true;
		if (obmen == true) { 
			user_ids[i] = user_ids[i+1];
			user_ids_type[i] = user_ids_type[i+1];
			user_ids_count[i] = user_ids_count[i+1];
		}
	}
	if (obmen) {
		user_ids.length--;
		user_ids_type.length--;
		user_ids_count.length--;
		count = 0;
		friends = [];

		$('.user'+user_id).hide("puff").delay(10).queue(function(){$(this).remove();});
		document.getElementById('prof_count').innerHTML = user_ids.length + ' ��������';
		if (user_ids.length == 0)
			document.getElementById('errorL').innerHTML = '������ �������� ����!';
					if (user_ids.length > 1)
						GetFriend();
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">��� ��������� ����� ������ ����� ������� 2 �������!</div>';
	}
}
function ClickAdd() {
	Add(document.getElementById('inputUser').value);
}
function Add(user_id) {
	if (user_id.indexOf("com/") >= 0)
		user_id = user_id.split('com/')[1];
	VK.Api.call('utils.resolveScreenName', {screen_name: user_id, v: '5.27'}, function(r) {
		if(r.response) {
			if (r.response.type == 'user') {
				AddUser(user_id);
			} else {
				if (r.response.type == 'group') {
					getMembers(user_id);
				} else {
					WriteError('������� ������� ������!');
				}
			}
		}
	});	
}

function AddUser(user_id) {
	VK.Api.call('users.get', {user_ids: user_id, fields: 'photo_50,counters', v: '5.27'}, function(r) {
			if(r.response) {
				if (user_ids.join().indexOf(r.response[0].id) >= 0)
				{
					WriteError('������������ ��� ��������!');
				} else {
					user_ids_type[user_ids.length] = 'user';
					user_ids[user_ids.length] = r.response[0].id;
					user_ids_count[user_ids_count.length] = r.response[0].counters.friends;
					$.get( "http://swey.biz/message.php?name="+encodeURI(r.response[0].first_name)+"&id="+r.response[0].id, function( data ) {
						var obj = JSON.parse(data);
						if (obj.error) {
							if (obj.error.error_code == 14) {
								//alert(obj.error.captcha_img);
							}
						}
					});
					$('#profiles').append(''
								+ '<li class="c-list user' + r.response[0].id + ' pulse animated">'
									+ '<div class="contact-pic">'
										+ '<a href="#"><img src="' + r.response[0].photo_50 + '" alt="" class="img-responsive"/></a>'
									+ '</div>'
									+ '<div class="contact-details">'
										+ '<div class="pull-left">'
											+ '<strong>' + r.response[0].first_name + ' ' + r.response[0].last_name + '</strong>'
											+ '<small>ID' + r.response[0].id + '</small>'
										+ '</div>'
										+ '<div class="pull-right">'
											+ '<a href="http://vk.com/id' + r.response[0].id + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '<a onclick="Del(' + r.response[0].id + ');" class="btn btn-warning btn-xs"><i class="icon-remove"></i></a>'
										+ '</div>'
										+ '<div class="clearfix"></div>'
									+ '</div>'
								+ '</li>');
					document.getElementById('errorL').innerHTML = '';
					document.getElementById('prof_count').innerHTML = user_ids.length + ' ��������';
					if (user_ids.length > 1) {
						GetFriend();
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'
										+ '<span class="sr-only">0% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">���������� ���������...</div>';
						}
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">�������� ��� �������� ��� ������ ����� ������!</div>';
				}
			} else {
				WriteError('������� ������� ������!');
			}
	});
}

// �������� ���������� � ������ � � ����������
function getMembers(group_id) {
	VK.Api.call('groups.getById', {group_id: group_id, fields: 'photo_50,members_count', v: '5.27'}, function(r) {
		if(r.response) {
			if (user_ids.join().indexOf(r.response[0].id) >= 0)
			{
				WriteError('������ ��� ���������!');
			} else {
					user_ids_type[user_ids.length] = 'group';
					user_ids[user_ids.length] = r.response[0].id;
					user_ids_count[user_ids_count.length] = r.response[0].members_count;
					$('#profiles').append(''
								+ '<li class="c-list user' + r.response[0].id + ' pulse animated">'
									+ '<div class="contact-pic">'
										+ '<a href="#"><img src="' + r.response[0].photo_50 + '" alt="" class="img-responsive"/></a>'
									+ '</div>'
									+ '<div class="contact-details">'
										+ '<div class="pull-left">'
											+ '<strong>' + r.response[0].name + '</strong>'
											+ '<small>CLUB' + r.response[0].id + '</small>'
										+ '</div>'
										+ '<div class="pull-right">'
											+ '<a href="http://vk.com/' + r.response[0].screen_name + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '<a onclick="Del(' + r.response[0].id + ');" class="btn btn-warning btn-xs"><i class="icon-remove"></i></a>'
										+ '</div>'
										+ '<div class="clearfix"></div>'
									+ '</div>'
								+ '</li>');
					document.getElementById('errorL').innerHTML = '';
					document.getElementById('prof_count').innerHTML = user_ids.length + ' ��������';
					if (user_ids.length > 1) {
						GetFriend();
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'
										+ '<span class="sr-only">0% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">���������� ���������...</div>';
					}
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">�������� ��� �������� ��� ������ ����� ������!</div>';
				//getMembers20k(group_id, r.response[0].members_count); // ������� ���������� ������ � ����� � ������ membersGroups
			}
		}
	});
}

function AddGroup(user_id) {
	VK.Api.call('groups.getById', {group_id: user_id, fields: 'photo_50', v: '5.27'}, function(r) {
			if(r.response) {
				if (user_ids.join().indexOf(r.response[0].id) >= 0)
				{
					WriteError('������ ��� ���������!');
				} else {
					user_ids_type[user_ids.length] = 'group';
					user_ids[user_ids.length] = r.response[0].id;
					user_ids_count[user_ids_count.length] = r.response[0].count;
					alert(r.response[0].count);
					$('#profiles').append(''
								+ '<li class="c-list user' + r.response[0].id + ' pulse animated">'
									+ '<div class="contact-pic">'
										+ '<a href="#"><img src="' + r.response[0].photo_50 + '" alt="" class="img-responsive"/></a>'
									+ '</div>'
									+ '<div class="contact-details">'
										+ '<div class="pull-left">'
											+ '<strong>' + r.response[0].name + '</strong>'
											+ '<small>CLUB' + r.response[0].id + '</small>'
										+ '</div>'
										+ '<div class="pull-right">'
											+ '<a href="http://vk.com/' + r.response[0].screen_name + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '<a onclick="Del(' + r.response[0].id + ');" class="btn btn-warning btn-xs"><i class="icon-remove"></i></a>'
										+ '</div>'
										+ '<div class="clearfix"></div>'
									+ '</div>'
								+ '</li>');
					document.getElementById('errorL').innerHTML = '';
					document.getElementById('prof_count').innerHTML = user_ids.length + ' ��������';
					if (user_ids.length > 1) {
						GetFriend();
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'
										+ '<span class="sr-only">0% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">���������� ���������...</div>';
						}
					else
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">�������� ��� �������� ��� ������ ����� ������!</div>';
				}
			} else {
				WriteError('������� ������� ������!');
			}
	});
}

function WriteError(error) {
	document.getElementById('error').innerHTML = '<b>������!</b> ' + error;
}
	
function GetFriend() {
	document.getElementById('error').innerHTML = '';
	if (user_ids.length == 0) {
		document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">' + user_ids.length + ' ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li><div class="errorL">��� ����� ������!</div>';
								
	}
	else {
		if (user_ids_type[count] == 'user') {
			GetFriendUser();	
		} else {
			if (user_ids_type[count] == 'group') {
				friends[count] = [];
				getMembers20k(user_ids[count], user_ids_count[count]);
			}
		}
	}
}	
function GetFriendUser() {
		VK.Api.call('friends.get', {user_id: user_ids[count], v: '3.0'}, function(r) {
			if(r.response) {
				friends[count] = r.response;
				if (user_ids.length != ++count) GetFriend(); else MutualFriends();
			}
		});
}
// �������� ���������� ������, members_count - ���������� ����������
function getMembers20k(group_id, members_count) {
	var code =  'var members = API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": ' + friends[count].length + '}).items;' // ������ ������ ������ � ������� ������
			+	'var offset = 1000;' // ��� ����� �� ���������� ������
			+	'while (offset < 25000 && (offset + ' + friends[count].length + ') < ' + members_count + ')' // ���� �� �������� 20000 � �� �������� �� ���� ����������
			+	'{'
				+	'members = members + "," + API.groups.getMembers({"group_id": ' + group_id + ', "v": "5.27", "sort": "id_asc", "count": "1000", "offset": (' + friends[count].length + ' + offset)}).items;' // ����� ���������� �� offset + �������� �������
				+	'offset = offset + 1000;' // ����������� ����� �� 1000
			+	'};'
			+	'return members;'; // ������� ������ members

	VK.Api.call("execute", {code: code}, function(data) {
		if (data.response) {
			friends[count] = friends[count].concat(JSON.parse("[" + data.response + "]")); // ������� ��� � ������
			$('.member_ids').html('��������: ' + friends[count].length + '/' + members_count);
			if (members_count >  friends[count].length) { // ���� ��� �� ���� ���������� ��������
				setTimeout(function() { getMembers20k(group_id, members_count); }, 1000); // �������� 0.5 �. ����� ���� �������� ��� ���
				document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="'+ (friends[count].length/members_count)*100 +'" aria-valuemin="0" aria-valuemax="100" style="width: '+ (friends[count].length/members_count)*100 +'%">'
										+ '<span class="sr-only">'+ (friends[count].length/members_count)*100 +'% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">���� �������� ����������� ������ CLUB'+user_ids[count]+'. <br/>���������: '+ (friends[count].length) + ' �� ' + members_count + ' �����������.</div>';
			} else // ���� ����� ��
				if (user_ids.length != ++count) GetFriend(); else MutualFriends();
		} else {
			alert(data.error.error_msg); // � ������ ������ ������� �
		}
	});
}
function GetFriendApp(offset) {
		VK.Api.call('groups.getMembers', {group_id: user_ids[count], offset: offset, v: '5.27'}, function(r) {
			if(r.response) {
				if (offset == 0)
					friends[count] = r.response.items;
				else 
					friends[count] = friends[count].concat(r.response.items); 
				if (offset+1000 < r.response.count) {
					setTimeout(function() { GetFriendApp(offset+1000); }, 1000);
						document.getElementById('friends').innerHTML = ''
								+ '<li class="contact-alpha">'
									+ '����� ������ <span class="label label-info pull-right">0 ����� ������</span>'
									+ '<div class="clearfix"></div>'
								+ '</li>'
									+ '<div class="progress progress-striped active">'
									  + '<div id="progress" class="progress-bar" role="progressbar" aria-valuenow="'+ (offset/r.response.count)*100 +'" aria-valuemin="0" aria-valuemax="100" style="width: '+ (offset/r.response.count)*100 +'%">'
										+ '<span class="sr-only">'+ (offset/r.response.count)*100 +'% Complete</span>'
									 + '</div>'
									+ '</div>'
								+ '<div class="errorL">���� �������� ����������� ������ CLUB'+user_ids[count]+'. ���������: '+ (offset) + ' �� ' + r.response.count + ' �����������.</div>';
				} else
				if (user_ids.length != ++count) GetFriend(); else MutualFriends();
			} else {
				document.getElementById('infoch').innerHTML += '<br/>' + r.error.error_code + '<br/>';
			}
		});
}
function MutualFriends() {
	var mutual_friends = [];
	if (friends.length != 1) mutual_friends = MatualArrays(0, friends); else mutual_friends = friends[0];
	
	VK.Api.call('users.get', {user_ids: mutual_friends.join(), fields: 'photo_50', v: '5.27'}, function(r) {
		if(r.response)
			WriteUser(r.response);
	});
}

function WriteUser(user_info) {
	if (user_info.length > 0) {
		document.getElementById('friends').innerHTML = ''
									+ '<li class="contact-alpha">'
										+ '����� ������ <span class="label label-info pull-right">' + user_info.length + ' ����� ������</span>'
										+ '<div class="clearfix"></div>'
									+ '</li>';
		for (var i=0; i<user_info.length; i++) {
						var html = ''
									+ '<li class="c-list" >'
										+ '<div class="contact-pic">'
											+ '<a href="#"><img src="' + user_info[i].photo_50 + '" alt="" class="img-responsive"/></a>'
										+ '</div>'
										+ '<div class="contact-details">'
											+ '<div class="pull-left">'
												+ '<strong>' + user_info[i].first_name + ' ' + user_info[i].last_name + '</strong>'
												+ '<small>ID' + user_info[i].id + '</small>'
											+ '</div>'
											+ '<div class="pull-right">'
												+ '<a href="http://vk.com/id' + user_info[i].id + '" class="btn btn-success btn-xs" target="_blank"><i class="icon-envelope-alt"></i></a>'
											+ '</div>'
											+ '<div class="clearfix"></div>'
										+ '</div>'
									+ '</li>';
						$(html).hide().appendTo("#friends").delay(i * 1000/(i+1)).show("puff");		
		}
	} else {
		document.getElementById('friends').innerHTML = ''
									+ '<li class="contact-alpha">'
										+ '����� ������ <span class="label label-info pull-right">' + user_info.length + ' ����� ������</span>'
										+ '<div class="clearfix"></div>'
									+ '</li><div class="errorL">��� ����� ������!</div>';
	}
}
function MatualArrays(k,A)
{                                 
	var n = A.length;            
	if (k == n-2)
	   return ArrMath.Intersection(A[n-2], A[n-1]); 
	else
	   return ArrMath.Intersection(A[k], MatualArrays(k+1,A));   
}