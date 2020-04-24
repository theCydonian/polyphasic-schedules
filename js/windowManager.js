$(document).ready(function() {
	// handles start button
	$('#start-test').click(function() {
		$('#profile').hide();
		$('#row-2').hide();
		$('#test-container').show();
	});

	$('#resume-test').click(function() {
		$('#profile').hide();
		$('#row-2').hide();
		$('#resume-container').show();
	});

	var testlist = ['#reaction-time','#short-memory','#long-memory'];
	$('#continue-button').click(function() {
		$('#reaction-time').hide();
		$('#short-memory').hide();
		$('#long-memory').hide();
		const current = parseInt($('#test-container').attr('data-selected'));
		if (current >= testlist.length - 1) {
			submit();
		} else {
			$(testlist[current + 1]).show();
			$('#test-container').attr('data-selected', current + 1);
		}
	});

	function submit() {
		$('#profile').show();
		$('#row-2').show();
		$('#test-container').hide();
		$('#test-container').attr('data-selected', '0');
		console.log($('#test-container').attr('data-selected'));
		$(testlist[0]).show();
	}
});