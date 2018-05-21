function thead(isShoppingCart) {
	var $thead = $("<div>").addClass("table-head");
	$thead.append(td("Score", "score"));
	$thead.append(td("Name", "name"));
	$thead.append(td("Category", "category"));
	$thead.append(td("No.", "th_number"));
	$thead.append(td("Heart", ""));
	$thead.append(td("Simple", ""));
	$thead.append(td("Gorgeous", ""));
	$thead.append(td("Cute", ""));
	$thead.append(td("Mature", ""));
	$thead.append(td("Lively", ""));
	$thead.append(td("Elegant", ""));
	$thead.append(td("Pure", ""));
	$thead.append(td("Sexy", ""));
	$thead.append(td("Cool", ""));
	$thead.append(td("Warm", ""));
	$thead.append(td("Tags", "th_tag"));
	$thead.append(td("Source", "th_from"));
	$thead.append(td("Suit", "th_issuit hidden"));
	$thead.append(td("Version", "th_version hidden"));
	$td_nbsp = td("", "");
	if (!isShoppingCart) {
		$td_nbsp = td("Go To Top", "th_gotop");
		$td_nbsp.addClass("gogogo-top");
		$td_nbsp.click(function () {
			goTop();
		});
	}
	$thead.append($td_nbsp);
	
	return $thead;
}

function td(data, cls, beforeText) {
	return $("<div>").addClass(cls).addClass("table-td").attr("before-text", beforeText).append(data);
}

function row(piece, isShoppingCart) {
	var $row = $("<div>").addClass("table-row");
	var $lineTop = $row;
	//var $lineTop = $("<div>").addClass("table-line");
	$lineTop.append(td(piece.sumScore, 'score'));
	if (isShoppingCart) {
		$lineTop.append(td(piece.name, (piece.version==lastVersion ? 'new' : '' )));
	} else {
		$lineTop.append(clothesNameTd(piece));
	}
	var csv = piece.toCsv();
	
	$lineTop.append(td(render(csv[0]), 'category'));
	$lineTop.append(td(render(csv[1]), 'id'));
	$lineTop.append(td(render(csv[2]), 'star'));
	$lineTop.append(td(render(csv[3]), getStyle(csv[3]), "简"));
	$lineTop.append(td(render(csv[4]), getStyle(csv[4]), "华"));
	$lineTop.append(td(render(csv[5]), getStyle(csv[5]), "可"));
	$lineTop.append(td(render(csv[6]), getStyle(csv[6]), "成"));
	$lineTop.append(td(render(csv[7]), getStyle(csv[7]), "活"));
	$lineTop.append(td(render(csv[8]), getStyle(csv[8]), "雅"));
	$lineTop.append(td(render(csv[9]), getStyle(csv[9]), "纯"));
	$lineTop.append(td(render(csv[10]), getStyle(csv[10]), "性"));
	$lineTop.append(td(render(csv[11]), getStyle(csv[11]), "凉"));
	$lineTop.append(td(render(csv[12]), getStyle(csv[12]), "暖"));
	$lineTop.append(td(render(csv[13]), 'tag'));
	$lineTop.append(td(render(csv[14]), 'source'));
	$lineTop.append(td(render(csv[15]), 'issuit hidden'));
	$lineTop.append(td(render(csv[16]), 'version hidden'));
	if (isShoppingCart) {
		if (piece.id) {
			$lineTop.append(td(removeShoppingCartButton(piece.type.type), 'icon'));
		}
	} else {
		$lineTop.append(td(shoppingCartButton(piece.type.mainType, piece.id), 'icon'));
	}
	//$row.append($lineTop);
	return $lineTop;
}

function render(rating) {
	if (rating.charAt(0) == '-') {
		return rating.substring(1);
	}
	return rating;
}

function getStyle(rating) {
	if (rating.charAt(0) == '-') {
		return 'negative empty';
	}
	else if(rating>0){
		return '';
	}
	switch (rating) {
	case "SSS":
		return 'SSS';
	case "SS":
		return 'SS';
	case "S":
		return 'S';
	case "A":
		return 'A';
	case "B":
		return 'B';
	case "C":
		return 'C';
	default:
		return "empty";
	}
}

function list(datas, isShoppingCart) {
	var $list = $("<div>").addClass("table-body");
	if (isShoppingCart) {
		$list.append(row(shoppingCart.totalScore, isShoppingCart));
	}
	for (var i in datas) {
		$list.append(row(datas[i], isShoppingCart));
	}
	return $list;
}

function clothesNameTd(piece) {
	var cls = "name table-td";
	var deps = piece.getDeps('   ', 1);
	var tooltip = '';
	if (deps && deps.length > 0) {
		tooltip = deps;
		if (deps.indexOf('需') > 0) {
			cls += ' deps';
		}else{
			cls += ' depsFin';
		}
	}
	cls += piece.own ? ' own' : '';

	var $clothesNameA = $("<a>").attr("href", "#").addClass("button");
	$clothesNameA.text(piece.name);
	if(tooltip != ''){
		$clothesNameA.attr("tooltip",tooltip);
		
	}
	$clothesNameA.click(function () {
		toggleInventory(piece.type.mainType, piece.id, this);
		return false;
	});
	var $clothesNameTd = $("<div>");
	$clothesNameTd.attr("id", "clickable-" + (piece.type.mainType + piece.id));
	$clothesNameTd.addClass(cls);
	$clothesNameTd.append($clothesNameA);
	return $clothesNameTd;
}

function clothesNameTd_Search(piece) {
	var cls = "name table-td search";
	cls += piece.own ? ' own' : '';

	var $clothesNameA = $("<a>").attr("href", "#").addClass("button");
	$clothesNameA.text(piece.name);
	$clothesNameA.click(function () {
		if ($('#searchResultMode').hasClass("active")){
			shoppingCart.put(clothesSet[piece.type.mainType][piece.id]);
			refreshShoppingCart();
			return false;
		}else{
			toggleInventory(piece.type.mainType, piece.id, this);
			return false;
		}
	});
	var $clothesNameTd = $("<div>");
	$clothesNameTd.attr("id", "clickable-" + (piece.type.mainType + piece.id));
	$clothesNameTd.addClass(cls);
	$clothesNameTd.append($clothesNameA);
	return $clothesNameTd;
}

function button_search(txt,cls1,cls2) {
	var $clothesNameA = $("<span>").addClass("button");
	if(cls2) $clothesNameA.addClass(cls2);
	$clothesNameA.text(txt);
	$clothesNameA.attr('id', 'search-'+txt);
	
	var $clothesNameTd = $("<div>").addClass('name table-td search');
	if(cls1) $clothesNameTd.addClass(cls1);
	$clothesNameTd.append($clothesNameA);
	return $clothesNameTd;
}

function shoppingCartButton(type, id) {
	$shoppingCartButton = $("<button>").addClass("glyphicon glyphicon-shopping-cart btn btn-default");
	$shoppingCartButton.click(function () {
		shoppingCart.put(clothesSet[type][id]);
		refreshShoppingCart();
	});
	return $shoppingCartButton;
}

function removeShoppingCartButton(detailedType) {
	$removeShoppingCartButton = $("<button>").addClass('glyphicon glyphicon-trash btn btn-xs btn-default');
	$removeShoppingCartButton.click(function () {
		shoppingCart.remove(detailedType);
		refreshShoppingCart();
	});
	return $removeShoppingCartButton;
}

function drawTable(data, divId, isShoppingCart) {
	var $table = $('#' + divId);
	$table.empty();
	$table.append(thead(isShoppingCart));
	$table.append(list(data, isShoppingCart));
}
