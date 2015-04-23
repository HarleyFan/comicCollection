<pre>
<?php 

  //save the file handle to a variable ... makes it easy to change the file
  //name in the future
  $file = 'box.xml';

  //load the file as a simplexml object ...
  //may want to add some logic here to make sure the file exists first!
  $xml = simplexml_load_file($file);
  
  
	//if(isset($_POST['deleteGroup'])) {
  	//	print_r($_POST); //print all checked elements
	//}
  
	foreach($_POST['deleteGroup'] as $value)
	{
		//$data = new SimpleXMLElement('box.xml',null,true);
		// Here we find the element boxNum = the checked box and get it's parent
		echo $value . "\n";
		$nodes = $xml->xpath('/collection/comic[boxNum="$value"]');
		echo $nodes[0]->store . "\n";
		$result = $nodes[0];
		echo $result . "\n";
		echo "store: " . $result->store . "\n";
		echo "series: " . $result->series . "\n";
		echo "number: " . $result->number . "\n";
	}
	


  //format the xml so it looks pretty
  $dom = new DOMDocument('1.0');
  $dom->preserveWhiteSpace = false;
  $dom->formatOutput = true;
  $dom->loadXML($xml->asXML());
  $dom->save($file);

?>
