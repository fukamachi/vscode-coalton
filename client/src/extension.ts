import * as net from 'net';
import { ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	StreamInfo
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(_context: ExtensionContext) {

	// TODO this is set up to connect to a local copy of coalton-lsp.
	// It ought to be shipped with lsp server binaries at some point.

	const connectionInfo = {
		port: 7887,
		host: "127.0.0.1"
	};
	const serverOptions = () => {
		// Connect to language server via socket
		const socket = net.connect(connectionInfo);
		const result: StreamInfo = {
			writer: socket,
			reader: socket
		};
		return Promise.resolve(result);
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'coalton' }, { scheme: 'file', language: 'common-lisp' }]
	};

	client = new LanguageClient(
		'coalton',
		'Coalton',
		serverOptions,
		clientOptions
	);

	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
