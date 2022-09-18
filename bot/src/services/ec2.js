const {
    EC2Client,
    StartInstancesCommand,
    DescribeInstanceStatusCommand
} = require('@aws-sdk/client-ec2');

const client = new EC2Client({ region: 'us-west-1' });

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

            return response.StartingInstances[0].PreviousState.Name;
        } catch (err) {
            return err;
        }
    }
}

exports.Instance = Instance;