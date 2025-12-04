#!/bin/bash

# Footer content to replace with
NEW_FOOTER='        <footer class="section page-footer">
            <div class="novi-background bg-cover bg-default">
              <div class="shell-wide">
                <div class="hr bg-gray-light"></div>
              </div>
          
              <div class="section-60" style="background: linear-gradient(135deg, #A51C30 0%, #b80924 100%) !important; color: #f8f9fa !important;">
                <div class="shell" style="max-width: 1000px;">
                  <div class="range range-30 range-lg-justify range-xs-center">
                    <!-- 左：EduTrust + 社交 -->
                    <div class="cell-md-2 cell-lg-2 text-center">
                      <img src="images/edutrust.webp" alt="EduTrust Certified" style="max-width: 180px; height: auto; opacity: 0.95;">
                      <div class="offset-top-20">
                      </div>
                    </div>
          
                    <!-- 中：联系信息 -->
                    <div class="cell-xs-10 cell-md-5 cell-lg-4 text-lg-left">
                      <h6 class="text-bold" style="color: white !important; font-size: 18px;">Contact us</h6>
                      <div class="text-subline" style="background: rgba(255,255,255,0.3); height: 2px;"></div>
                      <div class="offset-top-30">
                        <ul class="list-unstyled contact-info list">
                          <li>
                            <div class="unit unit-horizontal unit-middle unit-spacing-xs">
                              <div class="unit-left"><span class="icon novi-icon mdi mdi-phone text-middle icon-xs" style="color: rgba(255,255,255,0.8);"></span></div>
                              <div class="unit-body"><a style="color: #f8f9fa !important; text-decoration: none;" href="tel:+6562982749">+65 62982749</a></div>
                            </div>
                          </li>
                          <li>
                            <div class="unit unit-horizontal unit-middle unit-spacing-xs">
                              <div class="unit-left"><span class="icon novi-icon mdi mdi-map-marker text-middle icon-xs" style="color: rgba(255,255,255,0.8);"></span></div>
                              <div class="unit-body text-left"><a style="color: #f8f9fa !important; text-decoration: none;" href="#">1 Selegie Road #07-02, Singapore 188306</a></div>
                            </div>
                          </li>
                          <li>
                            <div class="unit unit-horizontal unit-middle unit-spacing-xs">
                              <div class="unit-left"><span class="icon novi-icon mdi mdi-email-open text-middle icon-xs" style="color: rgba(255,255,255,0.8);"></span></div>
                              <div class="unit-body"><a style="color: #f8f9fa !important; text-decoration: none;" href="mailto:info@demolink.org">info@demolink.org</a></div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
          
                    <!-- 右：Newsletter -->
                    <div class="cell-xs-10 cell-md-8 cell-lg-4 text-lg-left">
                      <h6 class="text-bold" style="color: white !important; font-size: 18px;">Newsletter</h6>
                      <div class="text-subline" style="background: rgba(255,255,255,0.3); height: 2px;"></div>
                      <div class="offset-top-30 text-left">
                        <p style="color: #f8f9fa !important; line-height: 1.6;">Enter your email address to get the latest University news, special events and student activities delivered right to your inbox.</p>
                      </div>
                      <div class="offset-top-10">
                        <form class="rd-mailform form-subscribe" data-form-output="form-output-global" data-form-type="subscribe" method="post" action="bat/rd-mailform.php">
                          <div class="form-group">
                            <div class="input-group input-group-sm">
                              <label class="form-label" for="form-email" style="color: #f8f9fa !important;">Your e-mail</label>
                              <input class="form-control" id="form-email" type="email" name="email" data-constraints="@Required @Email" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; border-radius: 4px;">
                              <span class="input-group-btn">
                                <button class="btn btn-sm btn-primary" type="submit" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; border-radius: 4px;">Subscribe</button>
                              </span>
                            </div>
                          </div>
                          <div class="form-output"></div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          
              <div class="section-5 context-dark novi-background" style="background: linear-gradient(135deg, #A51C30 0%, #b80924 100%) !important;">
                <div class="shell text-md-left">
                  <p>© <span class="copyright-year">2019</span> All Rights Reserved. Terms of Use and <a href="privacy.html">Privacy Policy.</a><span> Equistar International College</span></p>
                </div>
              </div>
            </div>
          </footer>
          
          <script>
            // 自动年份
            (function(){var el=document.querySelector(".copyright-year"); if(el){el.textContent=new Date().getFullYear();}})();
          </script>'

# Process each HTML file
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # Find the footer section and replace it
        # Look for footer tag and replace everything until the closing footer tag
        awk '
        BEGIN { 
            in_footer = 0
            footer_started = 0
        }
        /<footer/ { 
            in_footer = 1
            footer_started = 1
            print NEW_FOOTER
            next
        }
        in_footer && /<\/footer>/ { 
            in_footer = 0
            next
        }
        in_footer { 
            next
        }
        !in_footer { 
            print
        }
        ' NEW_FOOTER="$NEW_FOOTER" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
done

echo "Footer replacement completed!"
