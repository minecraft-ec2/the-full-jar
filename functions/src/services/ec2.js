const {
    EC2Client,
    StartInstancesCommand,
    StopInstancesCommand,
    DescribeInstanceStatusCommand
} = require('@aws-sdk/client-ec2');

const client = new EC2Client({ region: process.env.REGION || 'us-west-1' });

class Instance {
    params;

    constructor(id) {
        if (id == null) throw new Error('Instance id is required');
        this.params = { InstanceIds: [id] };
    }

    async status() {
        try {
            const response = await client.send(
                new DescribeInstanceStatusCommand({
                    ...this.params,
                    IncludeAllInstances: true
                })
            );

            return response.InstanceStatuses[0].InstanceState.Name;
        } catch (err) {
            return err;
        };

    }

    async start() {
        try {
            const response = await client.send(
                new StartInstancesCommand(this.params)
            );

            return response.StartingInstances;
        } catch (err) {
            return err;
        }
    }

    async stop() {
        try {
            const response = await client.send(
                new StopInstancesCommand(this.params)
            );

            return response.StoppingInstances;
        } catch (err) {
            return err;
        }
    }
}

exports.Instance = Instance;