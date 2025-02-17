process.title = 'https://github.com/insuperable';

const readline = require('readline');
const gradient = require('gradient-string');
const figlet = require('figlet');
const fetch = require('node-fetch');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const question = async(q) => {
    return new Promise((resolve) => {
        rl.question(gradient(['#ff91da', 'white'])(q), resolve);
    });
};

const WebhookSpam = async(Webhook, Message) => {
    while(true) {
        const response = await fetch(Webhook, {
            method: 'POST',
            body: JSON.stringify({ content: Message }),
            headers: { 'Content-Type': 'application/json' }
        });

        switch (response.status) {
            case 204:
                console.log(gradient(['#ff91da', 'white'])('[+] Message sent successfully.'));
                break;
            case 400:
                console.log(gradient(['#ff0800', 'white'])('[-] Message sent failed.'));
                break;
            case 429:
                const RetryAfter = response.headers.get('Retry-After');
                console.log(gradient(['#ff0800', 'white'])(`[-] Rate limited, ${RetryAfter} seconds.`));
                await new Promise(resolve => setTimeout(resolve, RetryAfter));
                break;
        }
    }
}

const DeleteWebhook = async(Webhook) => {
    const response = await fetch(Webhook, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    switch (response.status) {
        case 204:
            console.log(gradient(['#ff91da', 'white'])('[+] Webhook deleted successfully.'));
            break;
        case 404:
            console.log(gradient(['#ff0800', 'white'])('[-] Webhook not found.'));
            break;
    }
}

const GetWebhookInformation = async(Webhook) => {
    const response = await fetch(Webhook, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    console.log(gradient(['#ff91da', 'white'])(`[~] Webhook Name: ${data.name}\n[~] Guild ID: ${data.guild_id}\n[~] Channel ID: ${data.channel_id}`));
}

const RenameWebhook = async(Webhook, name) => {
    const response = await fetch(Webhook, {
        method: 'PATCH',
        headers: {  'Content-Type': 'application/json'  },
        body: JSON.stringify({ name })
    });

    switch (response.status) {
        case 200:
            console.log(gradient(['#ff91da', 'white'])('[+] Webhook renamed successfully.'));
            break;
        case 404:
            console.log(gradient(['#ff0800', 'white'])('[-] Webhook not found.'));
            break;      
    }
}

const CenterText = (text) => {
    return text.split('\n').map(line => line.padStart((process.stdout.columns + line.length) / 2)).join('\n');
};

(async () => {
    console.clear();
    console.log("\n\n\n" + gradient(['#ff91da', 'white'])(CenterText(await figlet('Discord Webhook Tool', { font: 'slant' }))));

    const choice = await question(CenterText('\n[1] Webhook Spammer\n[2] Webhook Deleter\n[3] Rename Webhook\n[4] Get Webhook Info\n\n[>] Your Choice: '));
    const webhook = await question(CenterText('[>] Webhook: '));

    switch (choice) {
        case '1':
            const message = await question(CenterText('[>] Message: '));
            WebhookSpam(webhook, message);
            console.clear();
            break;
        case '2':
            DeleteWebhook(webhook);
            console.clear();
            break;
        case '3':
            const name = await question(CenterText('[>] New Name: '));
            RenameWebhook(webhook, name);
            console.clear();
            break;
        case '4':
            GetWebhookInformation(webhook);
            console.clear();
            break;
    }
})();
