import { AbstractInstanceType } from "../../utils/types";
import Component, { ComponentInteraction } from "./Component";
import Logger from "../../utils/logger";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { pluralize } from "../../utils";
import { BaseError, ensureError, ErrorType } from "../../utils/errors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ComponentManager {
    // Class instances of components mapped by their customId
    private instances = new Map<string, Component>;

    // Create instances of all components and store them in a map
    async register(): Promise<void> {
        try {
            const dirpath = path.resolve(__dirname, "../../components");
            const filenames = fs.readdirSync(dirpath);

            for (const filename of filenames) {
                const filepath = path.resolve(dirpath, filename);

                const componentModule = await import(filepath);
                const componentClass = componentModule.default;
                const component: AbstractInstanceType<typeof Component> = new componentClass();

                this.instances.set(component.customId, component);
            }
        } catch (_error) {
            const cause = ensureError(_error);

            throw new BaseError("Failed to register components", {
                name: ErrorType.ComponentRegisterError,
                cause
            });
        }

        Logger.info(`Registered ${this.instances.size} ${pluralize(this.instances.size, "component")}`);
    }

    async handle(interaction: ComponentInteraction): Promise<void> {
        const component = this.instances.get(interaction.customId);

        if (!component) {
            throw new Error(`Component "${interaction.customId}" not found`);
        }

        await component.execute(interaction);
    }
}

export const components = new ComponentManager();