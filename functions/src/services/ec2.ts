import {
    EC2Client,
    StartInstancesCommand,
    StopInstancesCommand,
    DescribeInstanceStatusCommand
} from '@aws-sdk/client-ec2';

process.env = Object.assign(process.env, require('../config/aws.json'));

const client = new EC2Client({ region: process.env.REGION || 'us-west-1' });

class Instance {
    params;

    constructor(id: string) {
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

            // @ts-ignore - It probably wont be undefined
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
            console.error(err)
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

// @ts-ignore - This is loaded at the top of the file
export const instance = new Instance(process.env.INSTANCE_ID);