import amqp from 'amqplib/callback_api.js';

amqp.connect('amqp://localhost:5672', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'task_queue';

    //* This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.prefetch(1);
    console.log(' [*] Waiting for messages in %s.', queue);

    channel.consume(
      queue,
      function (msg) {
        const secs = msg.content.toString().split('.').length - 1;

        console.log(' [x] Received %s', msg.content.toString());
        setTimeout(function () {
          console.log(' [x] Done');
        }, secs * 1000);
      },
      {
        //* automatic acknowledgement mode
        noAck: false,
      },
    );
  });
});
