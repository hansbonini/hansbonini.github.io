import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { HTMLEscapeUnescapeModule } from 'html-escape-unescape'

import { AppComponent } from "./app.component";
import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";
import { StatusBarComponent } from "./components/status-bar/status-bar.component";
import { RecentPostListComponent } from "./components/recent-post-list/recent-post-list.component";
import { BackgroundCanvasComponent } from './components/background-canvas/background-canvas.component';

import { DataService } from "./services/data.service";

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { PostsComponent } from './pages/posts/posts.component';
import { PostComponent } from './pages/post/post.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { TagsComponent } from './pages/tags/tags.component';
import { MenuComponent } from './components/menu/menu.component';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { PostListComponent } from './components/post-list/post-list.component';

const appRoutes: Routes = [
  { path: "posts", component: HomeComponent },
  { path: "post/:slug", component: PostComponent },
  { path: "categories/:slug", component: CategoriesComponent },
  { path: "",  component: HomeComponent, pathMatch: "full" }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(
      appRoutes
      //{ enableTracing: true } // <-- debugging purposes only
    ),
    HttpClientModule,
    HTMLEscapeUnescapeModule
  ],
  declarations: [
    AppComponent,
    NavigationBarComponent,
    StatusBarComponent,
    RecentPostListComponent,
    BackgroundCanvasComponent,
    HomeComponent,
    AboutComponent,
    PostsComponent,
    PostComponent,
    CategoriesComponent,
    TagsComponent,
    MenuComponent,
    SlugifyPipe,
    PostListComponent
  ],
  bootstrap: [AppComponent],
  providers: [DataService]
})
export class AppModule {}
