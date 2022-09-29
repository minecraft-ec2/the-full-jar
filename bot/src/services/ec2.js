const {
    EC2Client,
    StartInstancesCommand,
    DescribeInstanceStatusCommand,
    DescribeAddressesCommand
} = require('@aws-sdk/client-ec2');
const axios = require('axios');

class Instance {
    constructor(id, client) {
        if (id == null) throw new Error('Instance id is required');
        this.params = { InstanceIds: [id] };
        this.client = client;
    }

    async status() {
        try {
            const response = await this.client.send(
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
            const response = await this.client.send(
                new StartInstancesCommand(this.params)
            );

            return response.StartingInstances[0].PreviousState.Name;
        } catch (err) {
            return err;
        }
    }

    async ip() {
        const response = await axios({
            url: process.env.IP_ENDPOINT,
            headers: {
                'Authorization': process.env.IP_API_KEY
            }
        });
        return response.data.ip;
    }
}

exports.Instance = Instance;