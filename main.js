function async(makeGenerator) {
  	return function() {
		let generator = makeGenerator.apply(this, arguments)

    	function handle (result) {
			if (result.done) {
        		return Promise.resolve(result.value)
      		}

      		return Promise.resolve(result.value).then(function(res) {
        		return handle(generator.next(res))
      		})
    	}

    	return handle(generator.next())
  	}
}

function foo(process) {
  	return new Promise(function(resolve) {
    	setTimeout(function() {
      		resolve(process)
    	}, 1000 - process)
  	})
}
  
function* bar() {
  	let promises = []
  	for (let p = 0; p < 5; p++) {
    	promises.push(foo(p))
  	}

  	for (let promise of promises) {
    	console.log(`from promise: ${yield promise}`)
  	}

  	return 'bar'
}

function* baz() {
  	yield* bar()
  	return 'baz'
}

async(baz)()
