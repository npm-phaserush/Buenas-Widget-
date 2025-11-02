import { Component } from '@angular/core';
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import { Body } from "../components/body/body";

@Component({
  selector: 'app-spinwheel',
  imports: [Header, Footer, Body],
  templateUrl: './spinwheel.html',
  styleUrl: './spinwheel.css',
})
export class Spinwheel {

}
