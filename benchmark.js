const siege = require('siege');
siege()
  .on(9200)
  .for(10000).times
  .post('/updatetrips')
  .attack()