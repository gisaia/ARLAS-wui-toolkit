import { Component, OnInit, Input } from '@angular/core';
import { MatCard, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, MatExpansionPanelState, MatIcon } from "@angular/material";
@Component({
  selector: 'arlas-analytics-board',
  templateUrl: './analytics-board.component.html',
  styleUrls: ['./analytics-board.component.css']
})
export class AnalyticsBoardComponent implements OnInit {

  @Input() public groups: Array<any>;
  constructor() { }

  ngOnInit() {
  }

}
