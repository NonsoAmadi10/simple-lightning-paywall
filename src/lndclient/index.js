import {createLnRpc} from '@radar/lnrpc';



async function lndClient(){

    const lnd  = await createLnRpc({
        server:process.env.LND_HOST,
        tls: process.env.TLS_CERT,
        macaroon: process.env.ADMIN_MACAROON,
      });

      return lnd;
}

export { lndClient }