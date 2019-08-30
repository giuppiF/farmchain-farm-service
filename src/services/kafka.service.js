
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
      console.log('okkkk aggiorno farm ' + product.farm._id + "con prodotto " + productData.name)
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

const kafkaService = (options, producer,client) => {
  var repo = options.repo;
  try {
    const Consumer = kafka.Consumer;
    var kafkaOptions = [{ topic: 'service.product', partition: 0 }]
    var kafkaConsumerOptions =  {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      fromOffset: false
    };
  
  let consumer = new Consumer(
    client,
    kafkaOptions,
    kafkaConsumerOptions
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
        messages: JSON.stringify({event: event, data: data})
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
    const Producer = kafka.Producer;

    const client = new kafka.KafkaClient({kafkaHost: options.kafkaSettings.server});

    const producer = new Producer(client);

    producer.on('ready', async function() {
      resolve(kafkaService(options,producer,client))
    });
    producer.on('error', function(err) {
      reject(new Error('kafka connection error'))
    });
    
  })
}

module.exports = Object.assign({}, {start})