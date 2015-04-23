$(document).ready(function() {	
	var seriesName;
	var seriesAlpha;
	var issueNumber;
	var storeName;
	var comicTotal = 0;
	var allStores = new Array();
	var seriesPrice = 0;
	var storePrice = 0;
	$.ajax({
		type: "GET",
		url: "box.xml",
		dataType: "xml",
		success: function(xml) {
			
			//Make an Array of all stores
			$(xml).find('comic').each(function() {	
				//count the total number of comics
				comicTotal++;
				
				storeName = $(this).find('store').text();
				
				if ($.inArray(storeName, allStores) < 0 ) {
					allStores.push(storeName);
				}
				
				else{
					return;
				}
			});
			
			//Loop through array of stores
			var h;
			for (h = 0; h < allStores.length; h++) {
				var storeNameID = allStores[h].replace(/\s+/g, '');
				//add store name to page as header 2
				$('form').append("<h2>" + allStores[h] + "</h2><div id='" + storeNameID + "'>");
				storePrice = 0;
				
				seriesAlpha = new Array();
				
				//Make an Array of all series
				$(xml).find('comic').each(function() {
					//set the series name
					seriesName = $(this).find('series').text();
		
					//set the store name
					var storeNameTemp = $(this).find('store').text();
					
					//Get the price of every comic in that store's box
					if(storeNameTemp == allStores[h]){
						storePrice = storePrice + parseFloat($(this).find('price').text());
					}
					
					//check if the series is already in the array and if the store matches the store being looked for
					if ($.inArray(seriesName, seriesAlpha) < 0 && storeNameTemp == allStores[h]) {
						seriesAlpha.push(seriesName);
					}
					
					else{
						return;
					}
					
				});
				var g = h+1;
				storePrice = storePrice.toFixed(2);
				$('h2:nth-of-type(' + g + ')').append(" <small>($" + storePrice + ")</small>");
					
				//sort the series alphabetically
				seriesAlpha.sort();
		
				//Loop through array of series
				var i;
				for (i = 0; i < seriesAlpha.length; i++) {
					//add series name to page as header 3
					var seriesNameID = seriesAlpha[i].replace(/\s+/g, '');
					$('#' + storeNameID).append("<div id='" + seriesNameID + "'><h3>" + seriesAlpha[i] + "</h3>");
					seriesPrice = 0;
					
					var issueOrder = new Array();
				
					//Make an Array of all issues
					$(xml).find('comic').each(function() {
					
						//set the issueNumber
						issueNumber = $(this).find('number').text();
						var seriesNameTemp = $(this).find('series').text();
						//set the store name
						var storeNameTemp = $(this).find('store').text();
					
						//Get the price of every comic in the series for that store
						if(seriesNameTemp == seriesAlpha[i] && storeNameTemp == allStores[h]){
							seriesPrice = seriesPrice + parseFloat($(this).find('price').text());
						}
						
						//check if the series matches the series being looked for and if the store is the correct store
						if (seriesNameTemp == seriesAlpha[i] && storeNameTemp == allStores[h]) {
							if ($.inArray(issueNumber, issueOrder) < 0 ) {
								issueOrder.push(issueNumber);
							}
							
							else{
								return;
							}
						}
						
						else{
							return;
						}
						
						issueOrder.sort(function(a, b) {
							if (isNaN(a) || isNaN(b)) {
								if (a > b) return 1;
								else return -1;
							}
							return a - b;
						});
					});
					
					seriesPrice = seriesPrice.toFixed(2);
					$('#' + storeNameID + ' h3:contains("' + seriesAlpha[i] + '")').append(" <small>($" + seriesPrice + ")</small>");
						
					//loop through array of issues in the series
					var j;
					for (j = 0; j < issueOrder.length; j++) {
				
						//loop through all comics to find those belonging to the series
						$(xml).find('comic').each(function() {
						
						//set the store name
						var storeNameTemp = $(this).find('store').text();
					
							//find each comic that is part of the series
							if($(this).find('series').text() == seriesAlpha[i] && $(this).find('number').text() == issueOrder[j] && storeNameTemp == allStores[h])
							{
								//set the variables
								var makeVariant;
								var issueNumber = $(this).find('number').text();
								var price = $(this).find('price').text();
								var printing;
								var varSpec;
								
								//check if issue is a variant or special edition
								if($(this).find('varSpec').text().length > 0)
								{
									varSpec = $(this).find('varSpec').text();
									makeVariant = 1;
								}
								
								else{
									makeVariant = 0;
								}							
								
								var cbName = $(this).find('boxNum').text();
								
								//Add issue information and checkbox
								$('#' + storeNameID + ' > #' + seriesNameID).append("<p class='indent'><input type='checkbox' name='deleteGroup[]' value='" + cbName + "' /> <b>Issue #" + issueNumber + "</b> <small>($" + price + ")</small></p>");
								
								//Add which printing it is, if not the first printing
								if($(this).find('printing').text().length > 0){
									printing = $(this).find('printing').text();
									$('#' + storeNameID + ' > #' + seriesNameID).append("<p class='indent2 join'>" + printing + " printing</p>");
								}
								
								//Add variant or special edition information to the listing
								if(makeVariant == 1){
									$('#' + storeNameID + ' > #' + seriesNameID).append("<p class='indent2 join'><i>" + varSpec + ".</i></p>");
								}
							}
							
							else {
								return;
							}
						});
						$('#' + seriesNameID).append("</div>");
					};
				};
				$('#' + storeNameID).append("</div>");
			};
			
			//print out the total number of comics
			$('h1').append(" (" + comicTotal + " comics still to purchase.)");
		},
		error: function() {
			alert("The XML File could not be processed correctly.");
		}
	});	
});
