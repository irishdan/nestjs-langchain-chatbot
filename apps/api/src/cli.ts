import { CommandFactory } from 'nest-commander';
import { CliModule } from './CliModule';

async function bootstrap() {
    await CommandFactory.run(CliModule, {
        errorHandler: (err: Error) => {
            console.log(err);
        },
    });
}

bootstrap();
