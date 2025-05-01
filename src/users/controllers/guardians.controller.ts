import { Controller } from "@nestjs/common";

@Controller({ version: '1', path: 'guardians' })
export class GuardiansController {
    constructor() { }
}