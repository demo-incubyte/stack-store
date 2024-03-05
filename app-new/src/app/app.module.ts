import { AuthService } from './services/Session';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpgradeModule } from '@angular/upgrade/static';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, UpgradeModule],
  providers: [AuthService, ],
  bootstrap: [AppComponent],
})
export class AppModule {}
