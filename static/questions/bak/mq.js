function mqQuestion(sentence){
	var mqs = [];
	for(var wordIndex = 0; wordIndex<sentence.length-1;){
		var word = sentence[wordIndex];
		var nextWord = sentence[wordIndex+1];
		var mqList = [];
		if(word.pos == 'm' && nextWord.pos=='q'){
			mqList = [word,nextWord];
			for(var wi = wordIndex+2;wi<sentence.length-1;wi=wi+2){
				var wi_next = wi+1;
				if(sentence[wi].pos == 'm'){
					mqList.push(sentence[wi]);
					if(sentence[wi_next].pos=='q'){
						mqList.push(sentence[wi_next]);
					}
				}
				else{
					break;
				}
			}
			mqs.push(mqList);
			wordIndex = wordIndex + mqList.length;
		}
		else{
			wordIndex++;
		}
	}
	var questions = [];
	for(var mqIndex = 0; mqIndex<mqs.length; mqIndex++){
		var mq = mqs[mqIndex];
		var text = "";
		for(var wordIndex = 0; wordIndex<sentence.length; wordIndex++){		
			var word = sentence[wordIndex];
			var indexOfWord = mq.indexOf(word);
			console.log(indexOfWord);
			if(indexOfWord<0 || indexOfWord ==1){
				text = text + word.cont;
				console.log(text);
			}
			if(indexOfWord==0){
				text = text + '多少';
			}
		}
		var newQuestion = {
			text : text,
			label : 'mq'
		};
		questions = pushQuestion(questions,newQuestion);
	}
	return questions;
}