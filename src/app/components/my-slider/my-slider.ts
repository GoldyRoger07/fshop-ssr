import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'my-slider',
  imports: [],
  templateUrl: './my-slider.html',
  styleUrl: './my-slider.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MySlider implements AfterViewInit{
  ngAfterViewInit(): void {
    
  }

}
