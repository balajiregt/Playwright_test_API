import {expect,Page} from '@playwright/test'

export default class productScreen{
    constructor(public page:Page){
    }

    async pagetitle(){
        await expect(this.page.locator('.title')).toHaveText('Products');
    }

    async leftsideMenuIcon(){
     await this.page.locator('#react-burger-menu-btn').click()
    }

    async logout_button(){
        await this.page.locator('#logout_sidebar_link').click()
    }
}