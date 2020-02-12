import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

const config = {
    devtool: 'source-map',
    mode: process.env.NODE_ENV || 'development',
<<<<<<< HEAD
=======
    devtool:
        process.env.NODE_ENV === 'production'
            ? 'inline-source-map'
            : 'source-map',
    performance: {
        hints: false,
    },
>>>>>>> v0.1.1: Update temporary bookmarks to use internal timer for display/removal, modify configuration
    entry: {
        // popup: path.join(__dirname, 'src/popup.js'),
        // options: path.join(__dirname, 'src/options.js'),
        background: path.join(__dirname, 'src/background.ts'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        query: {
                            compilerOptions: {
                                // Enables ModuleConcatenation. It must be in here to avoid conflict with ts-node
                                module: 'es2015',
                            },
                            // Make compilation faster with `fork-ts-checker-webpack-plugin`
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif)?$/,
                loader: 'file-loader?name=assets/[name].[ext]',
                exclude: /node_modules/,
            },
            {
                // To Do: Use pug instead of html
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin([
            {
                from: 'src/manifest.json',
                transform: function(content, _) {
                    // Update extension version and description using package.json
                    return Buffer.from(
                        JSON.stringify({
                            description: process.env.npm_package_description,
                            version: process.env.npm_package_version,
                            ...JSON.parse(content.toString()),
                        })
                    );
                },
            },
        ]),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
};
export default config;
