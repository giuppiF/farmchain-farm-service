
const fs = require('fs')
var path = require('path');
const AWS = require('aws-sdk');
var kafka = require('kafka-node');

const createProduct = async (repo,product) => {
  var productData = {
    _id: product._id,
    name: product.name,
    image: product.image,
    updatedAt: product.updatedAt,
    status: product.status,
    category: product.category
  }

  try{
    var farm = await repo.addProduct(product.farm._id,productData)
    farm ?
      console.log('okkkk')
    :
      console.log('error, product not found')
  } catch (err) {
    throw Error(err)
  }
}

const updateProduct = async (repo,product) => {
  var productData = {
    _id: product._id,
    name: product.name,
    image: product.image,
    updatedAt: product.updatedAt,
    status: product.status,
    category: product.category
  }


  try{
    var farm = await repo.updateProduct(product.farm._id,product._id,productData)
    farm ?
      console.log('okkkk')
    :
      console.log('error, product not found')
  } catch (err) {
    throw Error(err)
  }
}

const deleteProduct = async (repo,product) => {
  try{
    var farm = await repo.deleteProduct(product.farm._id,product._id)
    farm ?
      console.log('okkkk')
    :            
      console.log('error, product not found')
} catch (err) {
  throw Error(err)
}
}

const kafkaService = (options, producer) => {
  var repo = options.repo;
  try {
    const ConsumerGroup = kafka.ConsumerGroup;
    var kafkaGroupOptions = {
    kafkaHost: options.kafkaSettings.server , // connect directly to kafka broker (instantiates a KafkaClient)
    batch: undefined, // put client batch settings if you need them
    ssl: true, // optional (defaults to false) or tls options hash
    groupId: 'ProductServiceGroup',
    sessionTimeout: 15000,
    // An array of partition assignment protocols ordered by preference.
    // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
    protocol: ['roundrobin'],
    encoding: 'utf8', // default is utf8, use 'buffer' for binary data
   
    // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
    // equivalent to Java client's auto.offset.reset
    fromOffset: 'latest', // default
    commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
    // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
    outOfRangeOffset: 'earliest', // default
    // Callback to allow consumers with autoCommit false a chance to commit before a rebalance finishes
    // isAlreadyMember will be false on the first connection, and true on rebalances triggered after that
    onRebalance: (isAlreadyMember, callback) => { callback(); } // or null
  };
  
  let consumer = new ConsumerGroup(
    kafkaGroupOptions,
        ['service.product']
    );

    var productFunctions = {
      "create.product" : (repo,product) => {
        return createProduct(repo, product)
      },
      "update.product" : (repo,product) => {
          return updateProduct(repo, product)
        },
      "delete.product" : (repo,product) => {
          return deleteProduct(repo, product)
        },

    }
    consumer.on('message', async function(message) {

      var message_parsed = JSON.parse(message.value);
      productFunctions[message_parsed.event](repo,message_parsed.data)

    })
    consumer.on('error', function(err) {
        console.log('error', err);
    });
    }
    catch(e) { 
      throw Error(e)
    }

  const publishEvent = async (topic,event,data) =>  {

    let payloads = [
      {
        topic: topic,
        messages: JSON.stringify({event: event, data: data}),
        partition: 0,
        key: data._id
      }
    ];
    let push_status = producer.send(payloads, (err, data) => {
      if (err) {
        throw Error(err)
      } else {
        return;
      }
    });
  }
  return Object.create({
    publishEvent
  })
}


const start = (options) => {
  return new Promise((resolve, reject) => {

    if (!options) {
      reject(new Error('options settings not supplied!'))
    }
    const HighLevelProducer = kafka.HighLevelProducer;

    const client = new kafka.KafkaClient({kafkaHost: options.kafkaSettings.server});

    const producer = new HighLevelProducer(client,{partitionerType: 3});

    producer.on('ready', async function() {
      resolve(kafkaService(options,producer))
    });
    producer.on('error', function(err) {
      reject(new Error('kafka connection error'))
    });
    
  })
}

module.exports = Object.assign({}, {start})