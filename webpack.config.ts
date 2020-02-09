import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const config = {
    entry: './src',
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
        ],
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
    resolve: {
        extensions: ['.ts', '.js'],
    },
};
export default config;
